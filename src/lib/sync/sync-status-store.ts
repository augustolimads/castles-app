"use client";

import { create } from "zustand";

/**
 * Estados possíveis de sincronização
 */
export type SyncStatus =
	| "idle" // Sem atividade
	| "syncing" // Sincronizando
	| "synced" // Sincronizado com sucesso
	| "pending" // Mudanças pendentes
	| "error" // Erro na sincronização
	| "offline"; // Offline (sem conexão)

/**
 * Estado de sincronização
 */
interface SyncStatusState {
	status: SyncStatus;
	lastSync: number | null; // timestamp
	pendingChanges: number;
	currentOperation: string | null;
	error: string | null;
}

/**
 * Ações para gerenciar status de sincronização
 */
interface SyncStatusActions {
	setStatus: (status: SyncStatus) => void;
	setLastSync: (timestamp: number) => void;
	setPendingChanges: (count: number) => void;
	incrementPendingChanges: () => void;
	decrementPendingChanges: () => void;
	setCurrentOperation: (operation: string | null) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

const initialState: SyncStatusState = {
	status: "offline",
	lastSync: null,
	pendingChanges: 0,
	currentOperation: null,
	error: null,
};

/**
 * Store Zustand para gerenciar status de sincronização
 * 
 * Este store será integrado com o sync-manager na Fase 3
 */
export const useSyncStatusStore = create<
	SyncStatusState & SyncStatusActions
>((set) => ({
	...initialState,

	setStatus: (status) => set({ status }),

	setLastSync: (timestamp) =>
		set({ lastSync: timestamp, status: "synced", error: null }),

	setPendingChanges: (count) =>
		set({ pendingChanges: Math.max(0, count) }),

	incrementPendingChanges: () =>
		set((state) => ({
			pendingChanges: state.pendingChanges + 1,
			status: "pending",
		})),

	decrementPendingChanges: () =>
		set((state) => ({
			pendingChanges: Math.max(0, state.pendingChanges - 1),
		})),

	setCurrentOperation: (operation) => set({ currentOperation: operation }),

	setError: (error) => set({ error, status: "error" }),

	reset: () => set(initialState),
}));

/**
 * Hook para acessar o status de sincronização
 */
export const useSyncStatus = () => {
	const store = useSyncStatusStore();
	return store;
};
