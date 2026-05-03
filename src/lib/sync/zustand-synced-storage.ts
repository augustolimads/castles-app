/**
 * Storage adapter para Zustand que usa syncedLocalStorage
 *
 * Permite que stores Zustand sincronizem automaticamente com Supabase
 *
 * @example
 * ```typescript
 * import { create } from 'zustand';
 * import { persist } from 'zustand/middleware';
 * import { syncedStorage } from '@/lib/sync/zustand-synced-storage';
 *
 * const useStore = create(
 *   persist(
 *     (set) => ({ ... }),
 *     {
 *       name: 'my-store',
 *       storage: syncedStorage(), // Use esta factory
 *     }
 *   )
 * );
 * ```
 */

import { createJSONStorage } from "zustand/middleware";
import { syncedLocalStorage } from "./synced-local-storage";

/**
 * Factory que cria um storage sincronizado para Zustand (persist middleware)
 * Usa createJSONStorage para ser compatível com PersistStorage
 */
export const syncedStorage = () =>
	createJSONStorage(() => syncedLocalStorage);
