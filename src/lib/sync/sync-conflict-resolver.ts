/**
 * Resolvedor de conflitos de sincronização
 * 
 * Estratégia: Last-write-wins (timestamp mais recente prevalece)
 * 
 * Usado quando:
 * - Mesmo dado existe localmente e remotamente
 * - Ambos foram modificados em dispositivos diferentes
 */

interface DataWithTimestamp {
	lastModified?: number;
	updated_at?: number | string; // Supabase retorna ISO string
	[key: string]: unknown;
}

/**
 * Converte timestamp para número (aceita Date, string ISO, ou number)
 */
function normalizeTimestamp(value: unknown): number {
	if (typeof value === "number") {
		return value;
	}

	if (typeof value === "string") {
		return new Date(value).getTime();
	}

	if (value instanceof Date) {
		return value.getTime();
	}

	return 0; // Timestamp inválido
}

/**
 * Resolve conflito entre dados local e remoto
 * 
 * @param local - Dados locais (localStorage)
 * @param remote - Dados remotos (Supabase)
 * @returns "local" | "remote" - qual versão deve prevalecer
 */
export function resolveConflict(
	local: DataWithTimestamp,
	remote: DataWithTimestamp,
): "local" | "remote" {
	// Obter timestamps normalizados
	const localTimestamp = normalizeTimestamp(
		local.lastModified ?? local.updated_at ?? 0,
	);
	const remoteTimestamp = normalizeTimestamp(
		remote.updated_at ?? remote.lastModified ?? 0,
	);

	// Validar timestamps
	if (localTimestamp === 0 && remoteTimestamp === 0) {
		console.warn(
			"[ConflictResolver] Ambos os timestamps são inválidos, usando remoto por padrão",
		);
		return "remote";
	}

	if (localTimestamp === 0) {
		console.log("[ConflictResolver] Timestamp local inválido, usando remoto");
		return "remote";
	}

	if (remoteTimestamp === 0) {
		console.log("[ConflictResolver] Timestamp remoto inválido, usando local");
		return "local";
	}

	// Last-write-wins
	const winner = localTimestamp > remoteTimestamp ? "local" : "remote";

	console.log(
		`[ConflictResolver] Conflito resolvido: ${winner} vence (local: ${new Date(localTimestamp).toISOString()}, remote: ${new Date(remoteTimestamp).toISOString()})`,
	);

	return winner;
}

/**
 * Verifica se há conflito entre local e remoto
 * (ambos existem e têm timestamps diferentes)
 */
export function hasConflict(
	local: DataWithTimestamp | null,
	remote: DataWithTimestamp | null,
): boolean {
	if (!local || !remote) {
		return false; // Sem conflito se um dos lados não existe
	}

	const localTimestamp = normalizeTimestamp(
		local.lastModified ?? local.updated_at ?? 0,
	);
	const remoteTimestamp = normalizeTimestamp(
		remote.updated_at ?? remote.lastModified ?? 0,
	);

	return localTimestamp !== remoteTimestamp;
}

/**
 * Mescla dados locais e remotos (merge profundo simples)
 * 
 * NOTA: Por enquanto não é usado (last-write-wins prevalece),
 * mas pode ser útil para merge mais sofisticado no futuro.
 */
export function mergeData<T extends Record<string, unknown>>(
	local: T,
	remote: T,
): T {
	// Merge superficial: campos do remote sobrescrevem local
	// Preserva campos únicos de ambos os lados
	return {
		...local,
		...remote,
	};
}
