/**
 * Tipos para o sistema de sincronização localStorage ↔ Supabase
 */

export type SyncStatus =
	| "idle" // Não está sincronizando
	| "syncing" // Sincronizando agora
	| "synced" // Sincronizado com sucesso
	| "pending" // Há mudanças pendentes
	| "error" // Erro na última sincronização
	| "offline"; // Offline, não pode sincronizar

/**
 * Operação de sincronização individual
 */
export interface SyncOperation {
	id: string; // UUID da operação
	dataKey: string; // Chave do localStorage (ex: "castles-character-data-123")
	action: "upsert" | "delete"; // Tipo de operação
	data?: unknown; // Dados a sincronizar (undefined para delete)
	timestamp: number; // Timestamp da operação
}

/**
 * Item na fila de sincronização
 */
export interface SyncQueueItem extends SyncOperation {
	retries: number; // Número de tentativas
	lastError?: string; // Última mensagem de erro
}

/**
 * Resultado de uma sincronização completa
 */
export interface SyncResult {
	success: boolean;
	uploaded: number; // Número de itens enviados
	downloaded: number; // Número de itens baixados
	conflicts: number; // Número de conflitos resolvidos
	errors: string[]; // Erros encontrados
}

/**
 * Chaves do localStorage que devem ser sincronizadas
 */
export const SYNCABLE_KEY_PATTERNS = [
	/^castles-character-data-/, // Fichas de personagens (dados completos)
	/^castles-character-sheets$/, // Lista/metadados de fichas
	/^containers-data$/, // Containers
	/^cart-kits$/, // Kits salvos do carrinho
	/^hidden_items$/, // Itens ocultos
	/^compendium-favorites$/, // Favoritos do compêndio
	/^app-config$/, // Configurações
	/^tempo_/, // Dados de rastreamento de tempo
] as const;

/**
 * Chaves especiais do localStorage que NÃO devem ser sincronizadas
 */
export const NON_SYNCABLE_KEYS = [
	"sync-queue", // Fila de sincronização
	"storage-migration-completed", // Flag de migração local
	"cloud-migration-completed", // Flag de migração para nuvem
	"auth-store", // Estado de autenticação (gerenciado pelo Supabase)
] as const;

/**
 * Verifica se uma chave do localStorage deve ser sincronizada
 */
export function isSyncableKey(key: string): boolean {
	// Excluir chaves especiais
	if (NON_SYNCABLE_KEYS.includes(key as never)) {
		return false;
	}

	// Verificar se corresponde a algum padrão sincronizável
	return SYNCABLE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

/**
 * Obtém todas as chaves sincronizáveis do localStorage
 */
export function getAllSyncableKeys(): string[] {
	const keys: string[] = [];

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && isSyncableKey(key)) {
			keys.push(key);
		}
	}

	return keys;
}
