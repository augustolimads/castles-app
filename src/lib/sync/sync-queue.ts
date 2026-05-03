/**
 * Sistema de fila de sincronização para operações pendentes
 * 
 * Usado para enfileirar operações quando offline ou quando há erro de rede.
 * A fila é persistida no localStorage e processada quando a conexão é restaurada.
 */

import { useSyncStatusStore } from "./sync-status-store";
import type { SyncOperation, SyncQueueItem } from "./types";

const SYNC_QUEUE_KEY = "sync-queue";
const MAX_RETRIES = 3;

/**
 * Obtém a fila de sincronização do localStorage
 */
export function getQueue(): SyncQueueItem[] {
	try {
		const queueData = localStorage.getItem(SYNC_QUEUE_KEY);
		if (!queueData) return [];

		const queue = JSON.parse(queueData) as SyncQueueItem[];
		return Array.isArray(queue) ? queue : [];
	} catch (error) {
		console.error("[SyncQueue] Erro ao ler fila:", error);
		return [];
	}
}

/**
 * Salva a fila de sincronização no localStorage
 */
function saveQueue(queue: SyncQueueItem[]): void {
	try {
		localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
		
		// Atualizar contador de mudanças pendentes no store
		useSyncStatusStore.getState().setPendingChanges(queue.length);
	} catch (error) {
		console.error("[SyncQueue] Erro ao salvar fila:", error);
	}
}

/**
 * Adiciona uma operação à fila de sincronização
 */
export function addToQueue(operation: SyncOperation): void {
	const queue = getQueue();

	// Verificar se já existe operação para esta chave
	const existingIndex = queue.findIndex(
		(item) => item.dataKey === operation.dataKey,
	);

	const queueItem: SyncQueueItem = {
		...operation,
		retries: 0,
		lastError: undefined,
	};

	if (existingIndex !== -1) {
		// Atualizar operação existente (consolidar)
		queue[existingIndex] = queueItem;
		console.log(
			`[SyncQueue] Atualizada operação existente: ${operation.dataKey}`,
		);
	} else {
		// Adicionar nova operação
		queue.push(queueItem);
		console.log(`[SyncQueue] Nova operação adicionada: ${operation.dataKey}`);
	}

	saveQueue(queue);
}

/**
 * Remove uma operação da fila (após sync bem-sucedida)
 */
export function removeFromQueue(operationId: string): void {
	const queue = getQueue();
	const filtered = queue.filter((item) => item.id !== operationId);

	if (filtered.length !== queue.length) {
		console.log(`[SyncQueue] Operação removida: ${operationId}`);
		saveQueue(filtered);
	}
}

/**
 * Atualiza uma operação na fila (após erro/retry)
 */
export function updateQueueItem(
	operationId: string,
	updates: Partial<SyncQueueItem>,
): void {
	const queue = getQueue();
	const index = queue.findIndex((item) => item.id === operationId);

	if (index !== -1) {
		queue[index] = { ...queue[index], ...updates };
		saveQueue(queue);
	}
}

/**
 * Incrementa o contador de retries de uma operação
 */
export function incrementRetries(operationId: string, error?: string): void {
	const queue = getQueue();
	const index = queue.findIndex((item) => item.id === operationId);

	if (index !== -1) {
		const item = queue[index];
		item.retries += 1;
		item.lastError = error;

		// Se excedeu tentativas máximas, remover da fila
		if (item.retries >= MAX_RETRIES) {
			console.error(
				`[SyncQueue] Operação ${operationId} excedeu tentativas máximas, removendo da fila`,
			);
			queue.splice(index, 1);
		}

		saveQueue(queue);
	}
}

/**
 * Limpa a fila de sincronização
 */
export function clearQueue(): void {
	localStorage.removeItem(SYNC_QUEUE_KEY);
	useSyncStatusStore.getState().setPendingChanges(0);
	console.log("[SyncQueue] Fila limpa");
}

/**
 * Obtém estatísticas da fila
 */
export function getQueueStats(): {
	total: number;
	upserts: number;
	deletes: number;
	retried: number;
} {
	const queue = getQueue();

	return {
		total: queue.length,
		upserts: queue.filter((item) => item.action === "upsert").length,
		deletes: queue.filter((item) => item.action === "delete").length,
		retried: queue.filter((item) => item.retries > 0).length,
	};
}
