/**
 * Feature flags do sistema de sync.
 *
 * v1: sincronização cloud fica desativada por padrão.
 */
export function isCloudSyncEnabled(): boolean {
	return process.env.NEXT_PUBLIC_ENABLE_CLOUD_SYNC === "true";
}
