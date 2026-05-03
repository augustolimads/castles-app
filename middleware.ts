import type { Database } from "@/lib/supabase/types";
import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error(
		"Missing Supabase environment variables. Please check your .env.local file.",
	);
}

// Type assertions após validação
const validatedUrl = supabaseUrl as string;
const validatedKey = supabaseKey as string;

/**
 * Middleware para gerenciar autenticação Supabase
 * 
 * Este middleware é essencial para o fluxo PKCE funcionar corretamente.
 * Ele intercepta todas as requisições, detecta códigos de auth na URL,
 * mantém a sessão do usuário ativa e gerencia os cookies de autenticação.
 */
export async function middleware(request: NextRequest) {
	const code = request.nextUrl.searchParams.get("code");
	const isCallback = request.nextUrl.pathname === "/auth/callback";

	const response = isCallback
		? NextResponse.redirect(
			new URL(
				request.nextUrl.searchParams.get("next") ?? "/construtor-aventureiro",
				request.url,
			),
		)
		: NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

	const supabase = createClient<Database>(validatedUrl, validatedKey, {
		auth: {
			flowType: "pkce",
			detectSessionInUrl: true, // Detecta e processa código na URL automaticamente
			persistSession: true,
			storage: {
				getItem: (key: string) => {
					return request.cookies.get(key)?.value ?? null;
				},
				setItem: (key: string, value: string) => {
					response.cookies.set(key, value, {
						httpOnly: false, // Browser precisa ler os cookies de sessão
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						path: "/",
						maxAge: 60 * 60 * 24 * 365, // 1 ano
					});
				},
				removeItem: (key: string) => {
					response.cookies.set(key, "", {
						httpOnly: false, // Browser precisa ler os cookies de sessão
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						path: "/",
						maxAge: 0,
					});
				},
			},
		},
	});

	// Se estamos no callback com código, fazer exchange explicitamente
	if (isCallback && code) {
		console.log("[Middleware] Detectado código PKCE, fazendo exchange...");
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		
		if (error) {
			console.error("[Middleware] Erro ao trocar código:", error);
			response.headers.set("Location", new URL("/construtor-aventureiro?error=auth_error", request.url).toString());
			return response;
		}
		
		if (data.session) {
			console.log("[Middleware] Sessão criada com sucesso:", data.session.user.email);
		}
		
		// Sempre retornar o mesmo response para manter cookies setados no storage
		return response;
	}

	// Se estamos no callback sem código (erro do Supabase), redirecionar
	if (isCallback) {
		const error = request.nextUrl.searchParams.get("error");
		if (error) {
			console.error("[Middleware] Erro no callback:", error);
		}
		response.headers.set(
			"Location",
			new URL("/construtor-aventureiro", request.url).toString(),
		);
		return response;
	}

	// Refresh session - importante para manter o usuário logado
	const { data: { session } } = await supabase.auth.getSession();

	if (session) {
		console.log("[Middleware] Sessão ativa:", session.user.email);
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder files
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
