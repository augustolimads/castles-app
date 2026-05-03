"use client";

import { supabase } from "@/lib/supabase/client";
import { fullSync, processSyncQueue } from "@/lib/sync";
import { needsCloudMigration } from "@/lib/sync/cloud-migration";
import { useSyncStatusStore } from "@/lib/sync/sync-status-store";
import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { create } from "zustand";

/**
 * Estado de autenticação do Supabase
 */
interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	initialized: boolean;
}

/**
 * Ações de autenticação
 */
interface AuthActions {
	setUser: (user: User | null) => void;
	setSession: (session: Session | null) => void;
	setLoading: (loading: boolean) => void;
	setInitialized: (initialized: boolean) => void;
	signInWithMagicLink: (email: string) => Promise<{
		success: boolean;
		error?: string;
	}>;
	signOut: () => Promise<void>;
}

/**
 * Store Zustand para gerenciar estado de autenticação
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
	user: null,
	session: null,
	loading: true,
	initialized: false,

	setUser: (user) => set({ user }),
	setSession: (session) => set({ session }),
	setLoading: (loading) => set({ loading }),
	setInitialized: (initialized) => set({ initialized }),

	signInWithMagicLink: async (email: string) => {
		try {
			set({ loading: true });

			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				console.error("[Auth] Erro ao enviar magic link:", error);
				return {
					success: false,
					error: error.message,
				};
			}

			return { success: true };
		} catch (error) {
			console.error("[Auth] Erro inesperado:", error);
			return {
				success: false,
				error: "Erro inesperado ao enviar o link. Tente novamente.",
			};
		} finally {
			set({ loading: false });
		}
	},

	signOut: async () => {
		try {
			set({ loading: true });
			await supabase.auth.signOut();
			set({ user: null, session: null });
		} catch (error) {
			console.error("[Auth] Erro ao fazer logout:", error);
		} finally {
			set({ loading: false });
		}
	},
}));

/**
 * Hook para acessar estado e ações de autenticação
 */
export const useAuth = () => {
	const store = useAuthStore();
	return store;
};

/**
 * Provider de autenticação - gerencia listeners do Supabase
 * Deve ser adicionado no root layout
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { setUser, setSession, setLoading, setInitialized } = useAuthStore();
	const [showMigrationDialog, setShowMigrationDialog] = useState(false);

	useEffect(() => {
		console.log("[Auth Provider] Iniciando...");
		
		// Carregar sessão inicial
		supabase.auth.getSession().then(({ data: { session }, error }) => {
			console.log("[Auth Provider] Sessão inicial:", session?.user?.email || "nenhuma");
			if (error) console.error("[Auth Provider] Erro ao carregar sessão:", error);
			
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
			setInitialized(true);
		});

		// Listener para mudanças de autenticação
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			console.log("[Auth] Evento:", _event, "| Usuário:", session?.user?.email || "nenhum");
			
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);

			if (_event === "SIGNED_IN") {
				console.log("[Auth] Usuário logado:", session?.user?.email);
				// Sync completa ao fazer login (merge bidirecional)
				fullySync().catch(console.error);
				// Verificar se precisa de migração cloud (assíncrono, sem bloquear)
				needsCloudMigration().then((needs) => {
					if (needs) setShowMigrationDialog(true);
				}).catch(console.error);
			} else if (_event === "SIGNED_OUT") {
				console.log("[Auth] Usuário deslogado");
				// Resetar status de sync ao deslogar
				useSyncStatusStore.getState().setStatus("offline");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [setUser, setSession, setLoading, setInitialized]);

	// Import dinâmico para evitar circular dependency (dialog importa cloud-migration, use-auth importa sync)
	// biome-ignore lint/suspicious/noExplicitAny: lazy import do dialog
	const [MigrationDialog, setMigrationDialog] = useState<React.ComponentType<any> | null>(null);

	useEffect(() => {
		if (showMigrationDialog && !MigrationDialog) {
			import("@/modules/auth/cloud-migration-dialog").then((mod) => {
				setMigrationDialog(() => mod.CloudMigrationDialog);
			});
		}
	}, [showMigrationDialog, MigrationDialog]);

	return (
		<>
			{children}
			{showMigrationDialog && MigrationDialog && (
				<MigrationDialog
					open={showMigrationDialog}
					onOpenChange={setShowMigrationDialog}
				/>
			)}
		</>
	);
}

/**
 * Executa sync completa e processa fila pendente
 */
async function fullySync(): Promise<void> {
	const toastId = toast.loading("Sincronizando dados...");
	try {
		console.log("[Auth] Iniciando sync completa após login...");
		useSyncStatusStore.getState().setStatus("syncing");
		await processSyncQueue();
		await fullSync();
		console.log("[Auth] Sync completa após login concluída");
		toast.success("Sincronização concluída!", { id: toastId });
	} catch (error) {
		console.error("[Auth] Erro na sync após login:", error);
		toast.error("Erro ao sincronizar dados.", { id: toastId });
	}
}
