'use client';

import { syncedStorage } from '@/lib/sync/zustand-synced-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigStore {
  discordWebhook: string;
  setDiscordWebhook: (webhook: string) => void;
}

export const useConfig = create<ConfigStore>()(
  persist(
    (set) => ({
      discordWebhook: '',
      setDiscordWebhook: (webhook: string) => set({ discordWebhook: webhook }),
    }),
    {
      name: 'app-config', // nome da chave no localStorage
      storage: syncedStorage(), // Usa storage sincronizado
    }
  )
);
