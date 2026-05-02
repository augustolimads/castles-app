"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/modules/auth/use-auth";
import { LogOut, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthLoginDialog } from "./auth-login-dialog";

export function AuthMenu() {
	const { user, loading, signOut } = useAuth();
	const [showLoginDialog, setShowLoginDialog] = useState(false);

	const handleSignOut = async () => {
		await signOut();
		toast.success("Você saiu da sua conta");
	};

	// Enquanto carrega, mostrar skeleton
	if (loading) {
		return (
			<Button variant="outline" size="icon" disabled>
				<User className="h-[1.2rem] w-[1.2rem]" />
			</Button>
		);
	}

	// Se não estiver logado, mostrar botão de entrar
	if (!user) {
		return (
			<>
				<Button
					variant="outline"
					size="icon"
					onClick={() => setShowLoginDialog(true)}
					title="Entrar"
				>
					<User className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Entrar</span>
				</Button>

				<AuthLoginDialog
					open={showLoginDialog}
					onOpenChange={setShowLoginDialog}
				/>
			</>
		);
	}

	// Se estiver logado, mostrar dropdown com email e opções
	const userEmail = user.email || "Sem email";
	const userInitial = userEmail.charAt(0).toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" title={userEmail}>
					<div className="flex h-[1.2rem] w-[1.2rem] items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
						{userInitial}
					</div>
					<span className="sr-only">Menu do usuário</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">Conta</p>
						<p className="text-xs leading-none text-muted-foreground truncate">
							{userEmail}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem disabled>
					<Mail className="mr-2" />
					<span>{userEmail}</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut} className="text-destructive">
					<LogOut className="mr-2" />
					<span>Sair</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
