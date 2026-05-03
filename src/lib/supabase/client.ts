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
 * IMPORTANTE: Usa cookies (não localStorage) para sincronizar com o middleware.
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
export const supabase = createClient<Database>(supabaseUrl!, supabasePublishableKey!, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		flowType: "pkce",
        storage: {
            getItem: (key: string) => {
                if (typeof window === "undefined") return null;
                const cookies = document.cookie.split("; ");
                const cookie = cookies.find((c) => c.startsWith(`${key}=`));
                if (!cookie) {
                    console.log("[Cookie Storage] getItem:", key, "não encontrado");
                    return null;
                }
                const value = decodeURIComponent(cookie.split("=")[1]);
                console.log("[Cookie Storage] getItem:", key, "encontrado");
                return value;
            },
            setItem: (key: string, value: string) => {
                if (typeof window === "undefined") return;
                document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
            },
            removeItem: (key: string) => {
                if (typeof window === "undefined") return;
                document.cookie = `${key}=; path=/; max-age=0`;
            },
        },
	},
});
