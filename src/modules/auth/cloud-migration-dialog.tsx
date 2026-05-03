"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    countLocalDataItems,
    markMigrationDone,
    migrateLocalDataToCloud,
} from "@/lib/sync/cloud-migration";
import { CloudUpload, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CloudMigrationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CloudMigrationDialog({
	open,
	onOpenChange,
}: CloudMigrationDialogProps) {
	const totalItems = countLocalDataItems();
	const [status, setStatus] = useState<"idle" | "migrating" | "done">("idle");
	const [progress, setProgress] = useState({ current: 0, total: totalItems, currentKey: "" });

	const handleMigrate = async () => {
		setStatus("migrating");
		setProgress({ current: 0, total: totalItems, currentKey: "" });

		const result = await migrateLocalDataToCloud((current, total, currentKey) => {
			setProgress({ current, total, currentKey });
		});

		setStatus("done");

		if (result.success) {
			toast.success(
				`${result.migratedKeys.length} ${result.migratedKeys.length === 1 ? "item migrado" : "itens migrados"} para a nuvem!`,
			);
		} else {
			toast.warning(
				`Migração parcial: ${result.migratedKeys.length} enviados, ${result.errors.length} com erro.`,
			);
		}

		onOpenChange(false);
	};

	const handleSkip = () => {
		markMigrationDone();
		onOpenChange(false);
	};

	const isMigrating = status === "migrating";

	return (
		<Dialog open={open} onOpenChange={isMigrating ? undefined : onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<CloudUpload className="h-5 w-5 text-primary" />
						<DialogTitle>Sincronizar dados com a nuvem?</DialogTitle>
					</div>
					<DialogDescription>
						Encontramos{" "}
						<span className="font-semibold text-foreground">{totalItems}</span>{" "}
						{totalItems === 1 ? "item salvo" : "itens salvos"} localmente. Deseja
						enviá-los para a nuvem para acessar em outros dispositivos?
					</DialogDescription>
				</DialogHeader>

				{isMigrating && (
					<div className="space-y-2 py-2">
						<div className="flex items-center justify-between text-sm text-muted-foreground">
							<span>
								Enviando {progress.current} de {progress.total}...
							</span>
							<span>
								{progress.total > 0
									? Math.round((progress.current / progress.total) * 100)
									: 0}
								%
							</span>
						</div>
						<div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
							<div
								className="h-full bg-primary transition-all duration-300 rounded-full"
								style={{
									width:
										progress.total > 0
											? `${(progress.current / progress.total) * 100}%`
											: "0%",
								}}
							/>
						</div>
						{progress.currentKey && (
							<p className="text-xs text-muted-foreground truncate">
								{progress.currentKey}
							</p>
						)}
					</div>
				)}

				<DialogFooter className="flex-col-reverse sm:flex-row gap-2">
					<Button
						variant="ghost"
						onClick={handleSkip}
						disabled={isMigrating}
						className="gap-1"
					>
						<X className="h-4 w-4" />
						Agora não
					</Button>
					<Button onClick={handleMigrate} disabled={isMigrating} className="gap-2">
						{isMigrating ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<CloudUpload className="h-4 w-4" />
						)}
						{isMigrating ? "Enviando..." : "Sim, sincronizar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
