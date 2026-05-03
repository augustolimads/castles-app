import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

function getRequiredEnvVar(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(
		`Missing Supabase environment variable: ${name}. Please check your .env.local file.`,
	);
	}
	return value;
}

const supabaseUrl = getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const supabaseKey = getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

/**
 * Cliente Supabase para uso em Server Components e Route Handlers
 *
 * Este cliente gerencia cookies para persistir a sessão no servidor.
 * Diferente do cliente do browser, este cliente tem acesso aos cookies
 * da requisição HTTP e pode gerenciar a sessão no servidor.
 *
 * @example
 * ```typescript
 * import { createServerClient } from '@/lib/supabase/server';
 *
 * // Em um Route Handler
 * export async function GET(request: Request) {
 *   const supabase = await createServerClient();
 *   const { data, error } = await supabase.auth.getSession();
 * }
 *
 * // Em um Server Component
 * export default async function Page() {
 *   const supabase = await createServerClient();
 *   const { data: userData } = await supabase.from('user_data').select('*');
 * }
 * ```
 */
export async function createServerClient() {
	const cookieStore = await cookies();

	return createClient<Database>(supabaseUrl, supabaseKey, {
		auth: {
			flowType: "pkce",
			detectSessionInUrl: false,
			persistSession: true,
			storage: {
				getItem: (key: string) => {
					const cookie = cookieStore.get(key);
					return cookie?.value ?? null;
				},
				setItem: (key: string, value: string) => {
					cookieStore.set(key, value, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						path: "/",
						maxAge: 60 * 60 * 24 * 365, // 1 ano
					});
				},
				removeItem: (key: string) => {
					cookieStore.delete(key);
				},
			},
		},
	});
}
