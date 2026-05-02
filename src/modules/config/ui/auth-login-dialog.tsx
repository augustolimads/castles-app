"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/modules/auth/use-auth";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AuthLoginDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AuthLoginDialog({ open, onOpenChange }: AuthLoginDialogProps) {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	const { signInWithMagicLink } = useAuth();

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isValidEmail(email)) {
			toast.error("Digite um email válido");
			return;
		}

		setStatus("sending");

		const result = await signInWithMagicLink(email);

		if (result.success) {
			setStatus("success");
			toast.success("Email enviado! Verifique sua caixa de entrada", {
				description: "Clique no link enviado para fazer login",
			});
			
			// Limpar form e fechar dialog após 2 segundos
			setTimeout(() => {
				setEmail("");
				setStatus("idle");
				onOpenChange(false);
			}, 2000);
		} else {
			setStatus("error");
			toast.error("Erro ao enviar email", {
				description: result.error || "Tente novamente em alguns instantes",
			});
			
			// Reset para idle após 3 segundos
			setTimeout(() => setStatus("idle"), 3000);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		// Não permitir fechar durante envio
		if (status === "sending") return;
		
		// Reset ao fechar
		if (!newOpen) {
			setEmail("");
			setStatus("idle");
		}
		
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Entrar no Castles App</DialogTitle>
					<DialogDescription>
						Digite seu email para receber um link mágico de login. Sem senhas!
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="seu@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={status === "sending" || status === "success"}
							autoFocus
							required
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Button
							type="submit"
							className="w-full"
							disabled={status === "sending" || status === "success" || !email}
						>
							{status === "sending" ? (
								<>
									<Loader2 className="animate-spin" />
									Enviando...
								</>
							) : status === "success" ? (
								<>
									<Mail />
									Email enviado!
								</>
							) : (
								<>
									<Mail />
									Enviar Link Mágico
								</>
							)}
						</Button>

						{status === "success" && (
							<p className="text-sm text-muted-foreground text-center">
								Verifique sua caixa de entrada e clique no link para continuar
							</p>
						)}
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
