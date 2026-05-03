/**
 * Utilitário de migração de dados locais para a nuvem (Supabase).
 *
 * Executado no primeiro login do usuário quando há dados locais não sincronizados.
 * Utiliza a mesma lógica de upload do sync-manager, mas como operação explícita e rastreada.
 */

import { supabase } from "@/lib/supabase/client";
import { syncToCloud } from "./sync-manager";
import { getAllSyncableKeys } from "./types";

const MIGRATION_FLAG_KEY = "cloud-migration-completed";

/**
 * Verifica se a migração já foi executada neste dispositivo.
 */
function isMigrationDone(): boolean {
	if (typeof window === "undefined") return true;
	return localStorage.getItem(MIGRATION_FLAG_KEY) === "true";
}

/**
 * Marca a migração como concluída para não repetir.
 */
export function markMigrationDone(): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(MIGRATION_FLAG_KEY, "true");
}

/**
 * Verifica se há dados locais para migrar e ainda não foram enviados para a nuvem.
 *
 * Retorna `true` quando:
 * - A migração ainda não foi realizada neste dispositivo
 * - Há pelo menos uma chave sincronizável no localStorage
 * - O servidor não tem nenhum dado ainda para este usuário
 */
export async function needsCloudMigration(): Promise<boolean> {
	if (typeof window === "undefined") return false;
	if (isMigrationDone()) return false;

	// Verificar se há chaves locais para migrar
	const localKeys = getAllSyncableKeys();
	if (localKeys.length === 0) return false;

	// Verificar se o servidor já tem dados (evitar mostrar modal para usuários que já sincronizaram)
	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session?.user) return false;

		const { count, error } = await supabase
			.from("user_data")
			.select("*", { count: "exact", head: true })
			.eq("user_id", session.user.id);

		if (error) {
			console.error("[CloudMigration] Erro ao verificar dados remotos:", error);
			return false;
		}

		// Só migrar se o servidor estiver vazio para este usuário
		return (count ?? 0) === 0;
	} catch (error) {
		console.error("[CloudMigration] Erro inesperado:", error);
		return false;
	}
}

/**
 * Conta os itens locais disponíveis para migração.
 */
export function countLocalDataItems(): number {
	if (typeof window === "undefined") return 0;
	return getAllSyncableKeys().length;
}

export interface MigrationResult {
	success: boolean;
	migratedKeys: string[];
	errors: string[];
}

export type MigrationProgressCallback = (current: number, total: number, currentKey: string) => void;

/**
 * Migra todos os dados locais para o Supabase.
 *
 * @param onProgress - callback chamado a cada item migrado
 */
export async function migrateLocalDataToCloud(
	onProgress?: MigrationProgressCallback,
): Promise<MigrationResult> {
	const result: MigrationResult = {
		success: false,
		migratedKeys: [],
		errors: [],
	};

	if (typeof window === "undefined") return result;

	const localKeys = getAllSyncableKeys();
	const total = localKeys.length;

	if (total === 0) {
		result.success = true;
		markMigrationDone();
		return result;
	}

	for (let i = 0; i < total; i++) {
		const key = localKeys[i];
		onProgress?.(i + 1, total, key);

		try {
			const raw = localStorage.getItem(key);
			if (!raw) continue;

			let data: unknown;
			try {
				data = JSON.parse(raw);
			} catch {
				data = raw;
			}

			const ok = await syncToCloud(key, data);
			if (ok) {
				result.migratedKeys.push(key);
			} else {
				result.errors.push(`Falha ao enviar: ${key}`);
			}
		} catch (error) {
			const msg = error instanceof Error ? error.message : String(error);
			result.errors.push(`${key}: ${msg}`);
			console.error(`[CloudMigration] Erro ao migrar ${key}:`, error);
		}
	}

	result.success = result.errors.length === 0;
	markMigrationDone();
	return result;
}
