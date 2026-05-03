"use client";

import { fullSync, processSyncQueue } from "@/lib/sync";
import { useSyncStatusStore } from "@/lib/sync/sync-status-store";
import { useAuthStore } from "@/modules/auth/use-auth";
import { useEffect } from "react";
import { toast } from "sonner";

const SYNC_INTERVAL_MS = 3 * 60 * 1000; // 3 minutos

/**
 * Hook que gerencia sincronização automática em background.
 *
 * Responsabilidades:
 * - Polling periódico a cada 3 minutos (apenas se online + autenticado)
 * - Processar fila pendente ao reconectar à internet
 * - Atualizar status offline/idle ao perder/recuperar conexão
 */
export function useSyncScheduler() {
    const user = useAuthStore((s) => s.user);
    const setStatus = useSyncStatusStore((s) => s.setStatus);

    // Polling periódico
    useEffect(() => {
        if (!user) return;

      const interval = setInterval(() => {
          if (!navigator.onLine) return;
        processSyncQueue().catch((err) => {
            console.error("[SyncScheduler] Erro no polling:", err);
            toast.error("Erro ao sincronizar, tentando novamente...");
        });
    }, SYNC_INTERVAL_MS);

      return () => clearInterval(interval);
  }, [user]);

    // Listener de reconexão: processa fila e faz fullSync ao voltar online
    useEffect(() => {
        if (!user) return;

      const handleOnline = () => {
          console.log("[SyncScheduler] Voltou online — processando fila...");
          setStatus("syncing");
        fullSync().catch((err) => {
            console.error(
                "[SyncScheduler] Erro ao sincronizar ao voltar online:",
                err,
            );
          toast.error("Erro ao sincronizar, tentando novamente...");
      });
    };

      const handleOffline = () => {
          console.log("[SyncScheduler] Ficou offline");
          setStatus("offline");
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
      };
  }, [user, setStatus]);
}

/**
 * Componente wrapper para usar o hook no layout (Server Components não aceitam hooks).
 */
export function SyncScheduler() {
    useSyncScheduler();
    return null;
}
