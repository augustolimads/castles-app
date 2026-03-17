'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useConfig } from "@/hooks/use-config";
import * as CharGen from "@/modules/char-gen/ui";

function Configuracoes() {
  const { discordWebhook, setDiscordWebhook } = useConfig();

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
    </div>
  );
}

export default Configuracoes;