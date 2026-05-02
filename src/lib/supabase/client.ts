import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
	throw new Error(
		"Missing Supabase environment variables. Please check your .env.local file.",
	);
}

/**
 * Cliente Supabase singleton para uso no lado do cliente (browser)
 * 
 * Este cliente é configurado com a chave pública (publishable key) e
 * respeita as políticas Row Level Security (RLS) do banco de dados.
 * 
 * @example
 * ```typescript
 * import { supabase } from '@/lib/supabase/client';
 * 
 * // Autenticação
 * const { data, error } = await supabase.auth.signInWithOtp({
 *   email: 'user@example.com'
 * });
 * 
 * // Queries
 * const { data: userData } = await supabase
 *   .from('user_data')
 *   .select('*');
 * ```
 */
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		flowType: "pkce",
	},
});
