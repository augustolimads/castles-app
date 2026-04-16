'use client';

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useConfig } from "@/hooks/use-config";
import * as CharGen from "@/modules/char-gen/ui";
import { Config } from "@/modules/config/ui";
import { Download, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

function Configuracoes() {
  const { discordWebhook, setDiscordWebhook } = useConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key) || '';
        }
      }

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `castles-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Backup exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      toast.error('Erro ao exportar backup');
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validar se é um objeto válido
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
          toast.error('Arquivo inválido: formato não reconhecido');
          return;
        }

        // Limpar localStorage atual
        localStorage.clear();

        // Importar dados
        let importedCount = 0;
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string') {
            localStorage.setItem(key, value);
            importedCount++;
          }
        }

        if (importedCount > 0) {
          toast.success(`Backup importado com sucesso! ${importedCount} itens restaurados.`);
          // Recarregar a página para refletir as mudanças
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.warning('Nenhum dado válido encontrado no arquivo');
        }
      } catch (error) {
        console.error('Erro ao importar backup:', error);
        toast.error('Erro ao importar backup: arquivo inválido ou corrompido');
      }
    };
    reader.readAsText(file);

    // Limpar input para permitir reimportar o mesmo arquivo
    event.target.value = '';
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados salvos da aplicação. Tem certeza que deseja continuar?')) {
      try {
        localStorage.clear();
        toast.success('Todos os dados foram apagados');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('Erro ao limpar dados:', error);
        toast.error('Erro ao limpar dados');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-8 max-w-4xl mx-auto">
      <div className="flex gap-2">
        <SidebarTrigger />
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
          Configurações
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Integração Discord
        </h2>
        <CharGen.TextInput
          label="Webhook do Discord"
          id="discordWebhook"
          value={discordWebhook}
          onChange={setDiscordWebhook}
        />
        <p className="text-sm text-muted-foreground">
          Configure o webhook do Discord para enviar automaticamente os personagens gerados.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Alterar tema
        </h2>
        <Config.ThemeSelector />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Gerenciar Backups
        </h2>
        <p className="text-sm text-muted-foreground">
          Faça backup dos seus dados ou restaure de um arquivo salvo anteriormente.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExportBackup} variant="outline">
            <Download className="size-4" />
            Exportar Backup
          </Button>

          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Upload className="size-4" />
            Importar Backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleClearAllData} variant="destructive">
                <Trash2 className="size-4" />
                Limpar Todos os Dados
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>⚠️ Cuidado! Esta ação é irreversível.</p>
              <p>Todos os dados da aplicação serão apagados.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;