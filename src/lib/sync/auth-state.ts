/**
 * Estado de autenticação síncrono para uso no sistema de sync.
 *
 * Motivação: `sync-manager` e `synced-local-storage` precisam saber se o
 * usuário está autenticado para decidir se operam cloud ou local, mas não
 * podem importar `use-auth` diretamente (dependência circular).
 *
 * Este módulo é um intermediário puro (sem imports de React/Zustand/Supabase)
 * que recebe o estado de auth via setter chamado em `AuthProvider` e expõe
 * um getter síncrono consumido por `saveData` e `queueChange`.
 *
 * Fluxo:
 *   AuthProvider (use-auth.tsx)
 *     → setIsAuthenticatedForSync(true/false)
 *     → isAuthenticatedForSync() usado em sync-manager.ts
 */

let _isAuthenticated = false;

/**
 * Atualiza o estado síncrono de autenticação.
 * Deve ser chamado em `onAuthStateChange` e na carga inicial de sessão.
 */
export function setIsAuthenticatedForSync(authenticated: boolean): void {
	_isAuthenticated = authenticated;
	console.log(
		`[AuthState] isAuthenticated = ${String(authenticated)}`,
	);
}

/**
 * Retorna se o usuário está autenticado (síncrono, sem await).
 * Usado para decidir se operações de write devem envolver cloud.
 */
export function isAuthenticatedForSync(): boolean {
	return _isAuthenticated;
}
