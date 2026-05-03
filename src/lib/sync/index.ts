/**
 * Sistema de Sincronização localStorage ↔ Supabase
 * 
 * Exporta todas as funções e tipos necessários para sincronização
 */


// Conflict Resolution
export {
    hasConflict,
    mergeData,
    resolveConflict
} from "./sync-conflict-resolver";
// Sync Manager (core)
export {
    deleteData,
    fullSync,
    processSyncQueue,
    queueChange,
    saveData,
    syncFromCloud,
    syncToCloud
} from "./sync-manager";
// Queue Management
export {
    addToQueue,
    clearQueue,
    getQueue,
    getQueueStats,
    incrementRetries,
    removeFromQueue,
    updateQueueItem
} from "./sync-queue";
// Status Store
export { useSyncStatus, useSyncStatusStore } from "./sync-status-store";
// Wrapper de localStorage
export { syncedLocalStorage, useSyncedLocalStorage } from "./synced-local-storage";
// Types
export {
    getAllSyncableKeys,
    isSyncableKey,
    NON_SYNCABLE_KEYS,
    SYNCABLE_KEY_PATTERNS
} from "./types";
export type {
    SyncOperation,
    SyncQueueItem,
    SyncResult,
    SyncStatus
} from "./types";

// Zustand storage adapter
export { syncedStorage } from "./zustand-synced-storage";
