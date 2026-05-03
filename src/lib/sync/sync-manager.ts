/**
 * Motor de sincronização entre localStorage e Supabase
 *
 * Implementa sincronização bidirecional com merge de dados:
 * - Upload: envia dados locais → Supabase
 * - Download: baixa dados Supabase → localStorage
 * - Merge: preserva dados únicos de ambos os lados
 * - Conflitos: resolve por timestamp (last-write-wins)
 */

import { supabase } from "@/lib/supabase/client";
import { isAuthenticatedForSync } from "./auth-state";
import { resolveConflict } from "./sync-conflict-resolver";
import {
    addToQueue,
    getQueue,
    incrementRetries,
	removeFromQueue,
} from "./sync-queue";
import { useSyncStatusStore } from "./sync-status-store";
import type { SyncOperation, SyncResult } from "./types";
import { getAllSyncableKeys, isSyncableKey } from "./types";

const MAX_RETRY_DELAY = 5000; // 5 segundos
const SYNC_OPERATION_TIMEOUT_MS = 15000; // 15 segundos

class SyncTimeoutError extends Error {
	constructor(operation: string) {
		super(`Timeout na operação de sync: ${operation}`);
		this.name = "SyncTimeoutError";
	}
}

/**
 * Verifica se está online
 */
function isOnline(): boolean {
	return typeof navigator !== "undefined" && navigator.onLine;
}

/**
 * Verifica se está autenticado e retorna o usuário atual
 */
async function getCurrentUser(): Promise<{
	id: string;
	email?: string;
} | null> {
	if (typeof window === "undefined") return null;

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) return null;
	return { id: session.user.id, email: session.user.email };
}

/**
 * Verifica se está autenticado
 */
async function isAuthenticated(): Promise<boolean> {
	const user = await getCurrentUser();
	return !!user;
}

/**
 * Aguarda um tempo (delay) antes de retry
 */
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calcula delay exponencial para retry
 */
function getRetryDelay(retries: number): number {
	return Math.min(1000 * 2 ** retries, MAX_RETRY_DELAY);
}

/**
 * Executa uma promise com timeout de proteção.
 */
async function withTimeout<T>(
	promise: PromiseLike<T>,
	operation: string,
	ms = SYNC_OPERATION_TIMEOUT_MS,
): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;

	try {
		return await Promise.race([
			Promise.resolve(promise),
			new Promise<never>((_, reject) => {
				timer = setTimeout(() => {
					reject(new SyncTimeoutError(operation));
				}, ms);
			}),
		]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}

function isAuthError(error: unknown): boolean {
	if (!error || typeof error !== "object") return false;

	const authCodes = new Set(["PGRST301", "PGRST302", "401"]);

	const maybeCode = "code" in error ? String(error.code) : "";
	const maybeStatus = "status" in error ? String(error.status) : "";
	const maybeMessage =
		"message" in error ? String(error.message).toLowerCase() : "";

	return (
		authCodes.has(maybeCode) ||
		maybeStatus === "401" ||
		maybeMessage.includes("jwt") ||
		maybeMessage.includes("not authenticated") ||
		maybeMessage.includes("invalid token") ||
		maybeMessage.includes("session")
	);
}

function getFriendlySyncError(error: unknown): string {
	if (error instanceof SyncTimeoutError) {
		return "Sincronização demorou demais. Tentaremos novamente em breve.";
	}

	if (isAuthError(error)) {
		return "Sessão expirada. Faça login novamente para continuar sincronizando.";
	}

	if (error instanceof Error) {
		const message = error.message.toLowerCase();
		if (message.includes("network") || message.includes("fetch")) {
			return "Erro de rede ao sincronizar. Mudanças ficaram na fila para nova tentativa.";
		}
	}

	return "Erro ao sincronizar com a nuvem. Tentaremos novamente em breve.";
}

/**
 * Normaliza dados do localStorage para enviar ao Supabase
 */
function normalizeLocalData(
	key: string,
	value: string,
): {
	dataKey: string;
	dataValue: unknown;
	timestamp: number;
} {
	try {
		const parsed = JSON.parse(value);

	  // Extrair timestamp
	  const timestamp = parsed.lastModified ?? parsed.updated_at ?? Date.now();

	  return {
		  dataKey: key,
		  dataValue: parsed,
		  timestamp,
	  };
  } catch {
	  // Se não é JSON, salvar como string
	  return {
		  dataKey: key,
		  dataValue: value,
		  timestamp: Date.now(),
	  };
  }
}

/**
 * UPLOAD: Envia um dado local para o Supabase
 */
export async function syncToCloud(
	dataKey: string,
	data: unknown,
): Promise<boolean> {
	try {
		if (!isOnline()) {
			console.log(`[SyncManager] Offline, adicionando à fila: ${dataKey}`);
			queueChange(dataKey, data);
			return false;
		}

	  const currentUser = await getCurrentUser();
	  if (!currentUser) {
		  console.log(
			  `[SyncManager] Não autenticado, adicionando à fila: ${dataKey}`,
		  );
		  queueChange(dataKey, data);
		  return false;
	  }

	  useSyncStatusStore.getState().setCurrentOperation(`Enviando ${dataKey}`);

	  // Se data é null, deletar do servidor
	  if (data === null || data === undefined) {
		const { error } = await withTimeout(
			supabase
				.from("user_data")
				.delete()
			  .eq("user_id", currentUser.id)
			  .eq("data_key", dataKey),
		  `delete:${dataKey}`,
	  );

		if (error) throw error;

		console.log(`[SyncManager] Deletado do servidor: ${dataKey}`);
		return true;
	}

	  // Upsert (insert ou update) com user_id obrigatório
	  const { error } = await withTimeout(
		  supabase.from("user_data").upsert(
			  {
				  user_id: currentUser.id,
				  data_key: dataKey,
				  data_value: data as import("@/lib/supabase/types").Json,
				  updated_at: new Date().toISOString(),
			  },
			  { onConflict: "user_id,data_key" },
		),
		`upsert:${dataKey}`,
	);

	  if (error) throw error;

	  console.log(`[SyncManager] Enviado para servidor: ${dataKey}`);
	  return true;
  } catch (error) {
	  console.error(`[SyncManager] Erro ao enviar ${dataKey}:`, error);
	  const friendlyError = getFriendlySyncError(error);
	  useSyncStatusStore.getState().setError(friendlyError);

	  if (isAuthError(error)) {
		  await supabase.auth.signOut();
	  }

	  queueChange(dataKey, data);
	  return false;
  } finally {
	  useSyncStatusStore.getState().setCurrentOperation(null);
  }
}

/**
 * DOWNLOAD: Baixa um dado do Supabase para localStorage
 */
export async function syncFromCloud(dataKey: string): Promise<unknown | null> {
	try {
		if (!isOnline()) {
			console.log(`[SyncManager] Offline, não pode baixar: ${dataKey}`);
			return null;
		}

	  if (!(await isAuthenticated())) {
		console.log(`[SyncManager] Não autenticado, não pode baixar: ${dataKey}`);
		return null;
	}

	  const { data, error } = await withTimeout(
		  supabase.from("user_data").select("*").eq("data_key", dataKey).single(),
		  `download:${dataKey}`,
	  );

	  if (error) {
		  if (error.code === "PGRST116") {
			  // Not found - não é erro
			  console.log(`[SyncManager] Não existe no servidor: ${dataKey}`);
			  return null;
		  }
		  throw error;
	  }

	  useSyncStatusStore.getState().setCurrentOperation(`Baixando ${dataKey}`);

	  console.log(`[SyncManager] Baixado do servidor: ${dataKey}`);
	  return data.data_value;
  } catch (error) {
	  console.error(`[SyncManager] Erro ao baixar ${dataKey}:`, error);
	  useSyncStatusStore.getState().setError(getFriendlySyncError(error));
	  if (isAuthError(error)) {
		  await supabase.auth.signOut();
	  }
	  return null;
  } finally {
	  useSyncStatusStore.getState().setCurrentOperation(null);
  }
}

/**
 * SYNC COMPLETA: Sincroniza todos os dados (merge bidirecional)
 *
 * Comportamento:
 * - Download: busca dados remotos que não existem localmente
 * - Upload: envia dados locais que não existem remotamente
 * - Merge: para dados duplicados, resolve por timestamp
 *
 * IMPORTANTE: Não sobrescreve dados únicos de cada dispositivo!
 */
export async function fullSync(): Promise<SyncResult> {
	const result: SyncResult = {
		success: false,
		uploaded: 0,
		downloaded: 0,
		conflicts: 0,
		errors: [],
	};

	try {
		if (!isOnline()) {
			throw new Error("Offline - não é possível sincronizar");
		}

	  if (!(await isAuthenticated())) {
		  throw new Error("Não autenticado - faça login primeiro");
	  }

	  const currentUser = await getCurrentUser();
	  if (!currentUser) throw new Error("Usuário não encontrado");

	  useSyncStatusStore.getState().setStatus("syncing");
	  useSyncStatusStore.getState().setCurrentOperation("Sincronizando...");

	  // 1. Buscar TODOS os dados do servidor
	  const { data: remoteData, error: fetchError } = await withTimeout(
		  supabase.from("user_data").select("*"),
		  "fullSync:fetchRemote",
	  );

	  if (fetchError) throw fetchError;

	  // 2. Buscar TODAS as chaves locais sincronizáveis
	  const localKeys = getAllSyncableKeys();
	  const processedKeys = new Set<string>();

	  // 3. DOWNLOAD: Para cada dado remoto
	  for (const remote of remoteData ?? []) {
		  processedKeys.add(remote.data_key);

		const localValue = localStorage.getItem(remote.data_key);

		if (!localValue) {
			// Não existe local → baixar do servidor
			localStorage.setItem(
				remote.data_key,
				JSON.stringify(remote.data_value),
			);
			result.downloaded++;
			console.log(`[FullSync] Baixado: ${remote.data_key}`);
		} else {
			// Existe local E remoto → resolver conflito
			try {
				const localData = JSON.parse(localValue);
			const localTs =
				localData?.lastModified ?? localData?.updated_at ?? null;
			const remoteTs = remote?.updated_at ?? null;
			const winner = resolveConflict(localData, remote);

			if (winner === "remote") {
				// Remoto mais recente → sobrescrever local
				localStorage.setItem(
					remote.data_key,
					JSON.stringify(remote.data_value),
				);
				result.conflicts++;
				result.downloaded++;
				console.log(
				`[FullSync] Conflito resolvido (remoto vence): ${remote.data_key} | localTs=${String(localTs)} remoteTs=${String(remoteTs)}`,
			);
		  } else {
			  // Local mais recente → enviar para servidor
			  await syncToCloud(remote.data_key, localData);
			  result.conflicts++;
			  result.uploaded++;
			  console.log(
				`[FullSync] Conflito resolvido (local vence): ${remote.data_key} | localTs=${String(localTs)} remoteTs=${String(remoteTs)}`,
			);
			}
		} catch (error) {
			console.error(
				`[FullSync] Erro ao resolver conflito para ${remote.data_key}:`,
				error,
			);
				result.errors.push(`Erro em ${remote.data_key}: ${String(error)}`);
			}
		}
	}

	  // 4. UPLOAD: Para cada chave local que NÃO está no servidor
	  for (const localKey of localKeys) {
		  if (processedKeys.has(localKey)) {
			  continue; // Já processado acima
		  }

		const localValue = localStorage.getItem(localKey);
		if (!localValue) continue;

		try {
			const { dataValue } = normalizeLocalData(localKey, localValue);
			const success = await syncToCloud(localKey, dataValue);

			if (success) {
				result.uploaded++;
				console.log(`[FullSync] Enviado: ${localKey}`);
			} else {
				result.errors.push(`Falha ao enviar: ${localKey}`);
			}
		} catch (error) {
			console.error(`[FullSync] Erro ao enviar ${localKey}:`, error);
			result.errors.push(`Erro em ${localKey}: ${String(error)}`);
		}
	}

	  // Atualizar timestamp de última sincronização
	  await withTimeout(
		  supabase.from("user_profiles").upsert(
			  {
				  id: currentUser.id,
				  email: currentUser.email ?? "",
				  last_sync_at: new Date().toISOString(),
			  },
			  { onConflict: "id" },
		),
		"fullSync:updateProfile",
	);

	  result.success = result.errors.length === 0;

	  // Atualizar status
	  useSyncStatusStore.getState().setLastSync(Date.now());
	  useSyncStatusStore.getState().setStatus("synced");

	  console.log(
		  `[FullSync] Concluída: ${result.uploaded} enviados, ${result.downloaded} baixados, ${result.conflicts} conflitos, ${result.errors.length} erros`,
	  );

	  return result;
  } catch (error) {
	  console.error("[FullSync] Erro:", error);
	  result.errors.push(String(error));
	  useSyncStatusStore.getState().setError(getFriendlySyncError(error));
	  if (isAuthError(error)) {
		  await supabase.auth.signOut();
	  }
	  return result;
  } finally {
	  useSyncStatusStore.getState().setCurrentOperation(null);
  }
}

/**
 * Adiciona mudança à fila (quando offline ou erro)
 */
export function queueChange(dataKey: string, data: unknown): void {
	if (!isSyncableKey(dataKey)) {
		console.log(`[SyncManager] Chave não sincronizável: ${dataKey}`);
		return;
	}

	// Não enfileirar quando deslogado — evita acúmulo de fila sem utilidade
	if (!isAuthenticatedForSync()) {
		console.log(`[SyncManager] Não autenticado, ignorando fila: ${dataKey}`);
		return;
	}

	const operation: SyncOperation = {
		id: crypto.randomUUID(),
		dataKey,
		action: data === null || data === undefined ? "delete" : "upsert",
		data,
		timestamp: Date.now(),
	};

	addToQueue(operation);
	useSyncStatusStore.getState().setStatus("pending");
	console.log(`[SyncManager] Operação adicionada à fila: ${dataKey}`);
}

/**
 * Processa fila de sincronização pendente
 */
export async function processSyncQueue(): Promise<void> {
	const queue = getQueue();

	if (queue.length === 0) {
		console.log("[SyncManager] Fila vazia, nada a processar");
		return;
	}

	if (!isOnline()) {
		console.log("[SyncManager] Offline, não pode processar fila");
		return;
	}

	if (!(await isAuthenticated())) {
		console.log("[SyncManager] Não autenticado, não pode processar fila");
		return;
	}

	console.log(`[SyncManager] Processando fila: ${queue.length} operações`);
	useSyncStatusStore.getState().setStatus("syncing");

	for (const item of queue) {
		try {
			useSyncStatusStore
				.getState()
				.setCurrentOperation(`Sincronizando ${item.dataKey}`);

		const success = await syncToCloud(item.dataKey, item.data);

		if (success) {
			removeFromQueue(item.id);
		} else {
			// Retry com delay exponencial
			const retryDelay = getRetryDelay(item.retries);
			await delay(retryDelay);

			  incrementRetries(item.id, "Falha ao sincronizar");
		  }
	  } catch (error) {
		  console.error(
			  `[SyncManager] Erro ao processar operação ${item.id}:`,
			  error,
		  );
		  incrementRetries(item.id, String(error));
	  }
  }

	const remainingQueue = getQueue();

	if (remainingQueue.length === 0) {
		useSyncStatusStore.getState().setStatus("synced");
		useSyncStatusStore.getState().setLastSync(Date.now());
		console.log("[SyncManager] Fila processada com sucesso");
	} else {
		useSyncStatusStore.getState().setStatus("pending");
		console.log(
			`[SyncManager] Fila parcialmente processada, ${remainingQueue.length} operações restantes`,
		);
	}

	useSyncStatusStore.getState().setCurrentOperation(null);
}

/**
 * Deleta um dado tanto localmente quanto no servidor
 */
export async function deleteData(dataKey: string): Promise<boolean> {
	// Deletar localmente
	localStorage.removeItem(dataKey);

	// Tentar deletar do servidor
	return await syncToCloud(dataKey, null);
}

/**
 * Salva um dado localmente e tenta sincronizar
 */
export function saveData(dataKey: string, data: unknown): void {
	// Sempre salvar localmente (fonte local é a cache para v1)
	localStorage.setItem(dataKey, JSON.stringify(data));

	// Só enviar para cloud se o usuário estiver autenticado
	if (!isAuthenticatedForSync()) {
		return;
	}

	if (isOnline()) {
		syncToCloud(dataKey, data).catch((error) => {
			console.error(`[SyncManager] Erro ao sincronizar ${dataKey}:`, error);
		});
	} else {
		queueChange(dataKey, data);
	}
}
