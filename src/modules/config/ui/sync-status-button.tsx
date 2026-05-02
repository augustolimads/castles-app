"use client";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSyncStatus } from "@/lib/sync/sync-status-store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/use-auth";
import {
    AlertCircle,
    Check,
    Clock,
    Cloud,
    CloudOff,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Componente de botão de status de sincronização
 * Exibe o estado atual da sincronização e permite sync manual
 */
export function SyncStatusButton() {
	const { status, lastSync, pendingChanges, error } = useSyncStatus();
	const { user } = useAuth();
	const [isOnline, setIsOnline] = useState(true);

	// Detectar status de conexão
	useEffect(() => {
		const updateOnlineStatus = () => setIsOnline(navigator.onLine);

		updateOnlineStatus();
		window.addEventListener("online", updateOnlineStatus);
		window.addEventListener("offline", updateOnlineStatus);

		return () => {
			window.removeEventListener("online", updateOnlineStatus);
			window.removeEventListener("offline", updateOnlineStatus);
		};
	}, []);

	// Função de sync manual (placeholder para Fase 3)
	const handleManualSync = () => {
		if (!user) {
			toast.error("Faça login para sincronizar");
			return;
		}

		if (!isOnline) {
			toast.error("Você está offline");
			return;
		}

		// TODO: Implementar sync manual na Fase 3
		toast.info("Sincronização manual será implementada na Fase 3");
	};

	// Calcular tempo desde última sincronização
	const getLastSyncText = () => {
		if (!lastSync) return "Nunca sincronizado";

		const now = Date.now();
		const diff = now - lastSync;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return `há ${days}d`;
		if (hours > 0) return `há ${hours}h`;
		if (minutes > 0) return `há ${minutes}min`;
		return "agora";
	};

	// Determinar ícone baseado no status
	const getIcon = () => {
		if (!isOnline) return <CloudOff className="h-[1.2rem] w-[1.2rem]" />;
		if (!user) return <Cloud className="h-[1.2rem] w-[1.2rem]" />;

		switch (status) {
			case "syncing":
				return <Loader2 className="h-[1.2rem] w-[1.2rem] animate-spin" />;
			case "synced":
				return <Check className="h-[1.2rem] w-[1.2rem]" />;
			case "pending":
				return <Clock className="h-[1.2rem] w-[1.2rem]" />;
			case "error":
				return <AlertCircle className="h-[1.2rem] w-[1.2rem]" />;
			case "offline":
				return <CloudOff className="h-[1.2rem] w-[1.2rem]" />;
			default:
				return <Cloud className="h-[1.2rem] w-[1.2rem]" />;
		}
	};

	// Determinar texto do tooltip
	const getTooltipText = () => {
		if (!isOnline) return "Você está offline";
		if (!user) return "Faça login para sincronizar";

		switch (status) {
			case "syncing":
				return "Sincronizando...";
			case "synced":
				return `Sincronizado • ${getLastSyncText()}`;
			case "pending":
				return `${pendingChanges} ${pendingChanges === 1 ? "mudança pendente" : "mudanças pendentes"}`;
			case "error":
				return error || "Erro na sincronização";
			case "offline":
				return "Offline";
			default:
				return "Clique para sincronizar";
		}
	};

	// Determinar variante do botão baseado no status
	const getVariant = () => {
		if (status === "error") return "destructive";
		return "outline";
	};

	// Cor do ícone
	const getIconColor = () => {
		if (!isOnline || !user) return "text-muted-foreground";

		switch (status) {
			case "syncing":
				return "text-blue-500";
			case "synced":
				return "text-green-500";
			case "pending":
				return "text-yellow-500";
			case "error":
				return "text-destructive";
			case "offline":
				return "text-muted-foreground";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={getVariant()}
						size="icon"
						onClick={handleManualSync}
						disabled={!user || !isOnline || status === "syncing"}
						title={getTooltipText()}
					>
						<span className={cn(getIconColor())}>{getIcon()}</span>
						<span className="sr-only">{getTooltipText()}</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent side="top" className="max-w-xs">
					<div className="flex flex-col gap-1">
						<p className="font-semibold">{getTooltipText()}</p>
						{lastSync && status !== "error" && (
							<p className="text-xs text-muted-foreground">
								Última sync: {getLastSyncText()}
							</p>
						)}
						{pendingChanges > 0 && (
							<p className="text-xs text-muted-foreground">
								{pendingChanges} {pendingChanges === 1 ? "item pendente" : "itens pendentes"}
							</p>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
