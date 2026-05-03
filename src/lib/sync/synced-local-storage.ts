/**
 * Wrapper transparente do localStorage com sincronização automática
 * 
 * Uso:
 * ```typescript
 * import { syncedLocalStorage } from '@/lib/sync/synced-local-storage';
 * 
 * // Usar como localStorage normal
 * syncedLocalStorage.setItem('key', 'value'); // Salva E sincroniza
 * const value = syncedLocalStorage.getItem('key');
 * syncedLocalStorage.removeItem('key'); // Remove E sincroniza
 * ```
 * 
 * Comportamento:
 * - Se online + autenticado → sync imediato
 * - Se offline ou não autenticado → adiciona à fila
 * - Fila é processada automaticamente quando online/autenticado
 */

import { queueChange, saveData } from "./sync-manager";
import { isSyncableKey } from "./types";

/**
 * Wrapper do localStorage com sincronização automática
 */
export const syncedLocalStorage = {
	/**
	 * Lê um item do localStorage (sem sync)
	 */
	getItem(key: string): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.getItem(key);
	},

	/**
	 * Salva um item no localStorage E sincroniza
	 */
	setItem(key: string, value: string): void {
		if (typeof window === "undefined") return;

		// Se é chave sincronizável, delegar ao saveData (que já escreve no localStorage)
		if (isSyncableKey(key)) {
			try {
				const parsed = JSON.parse(value);
				saveData(key, parsed);
			} catch {
				// Se não é JSON, salvar como string
				saveData(key, value);
			}
		} else {
			// Chave não sincronizável: salvar apenas localmente
			localStorage.setItem(key, value);
		}
	},

	/**
	 * Remove um item do localStorage E sincroniza
	 */
	removeItem(key: string): void {
		if (typeof window === "undefined") return;

		// Remover localmente
		localStorage.removeItem(key);

		// Se é chave sincronizável, sincronizar delete
		if (isSyncableKey(key)) {
			queueChange(key, null); // null = delete
		}
	},

	/**
	 * Limpa todo o localStorage (NÃO sincroniza - perigoso!)
	 */
	clear(): void {
		if (typeof window === "undefined") return;
		console.warn(
			"[SyncedLocalStorage] clear() não sincroniza - use com cuidado!",
		);
		localStorage.clear();
	},

	/**
	 * Obtém o número de itens no localStorage
	 */
	get length(): number {
		if (typeof window === "undefined") return 0;
		return localStorage.length;
	},

	/**
	 * Obtém a chave do item no índice especificado
	 */
	key(index: number): string | null {
		if (typeof window === "undefined") return null;
		return localStorage.key(index);
	},
};

/**
 * Hook React para usar o syncedLocalStorage com re-render automático
 * 
 * @example
 * ```typescript
 * const [value, setValue] = useSyncedLocalStorage('my-key', 'default');
 * ```
 */
export function useSyncedLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: T) => void] {
	// Estado para forçar re-render
	const [storedValue, setStoredValue] = React.useState<T>(() => {
		try {
			const item = syncedLocalStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch {
			return initialValue;
		}
	});

	const setValue = (value: T) => {
		try {
			setStoredValue(value);
			syncedLocalStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`[useSyncedLocalStorage] Erro ao salvar ${key}:`, error);
		}
	};

	return [storedValue, setValue];
}

// Adicionar import do React se usar o hook
import React from "react";
