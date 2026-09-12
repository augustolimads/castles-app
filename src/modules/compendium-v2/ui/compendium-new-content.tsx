"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompendiumForm, type CompendiumFormValue } from "./compendium-form";

export function CompendiumNewContent() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (value: CompendiumFormValue) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/compendium-v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const payload = (await response.json()) as {
        id?: string;
        error?: string;
      };

      if (!response.ok || !payload.id) {
        throw new Error(payload.error ?? "Falha ao criar item");
      }

      router.push(`/compendium/${payload.id}`);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Erro inesperado";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <header className="rounded-lg border bg-secondary p-4">
              <div className="flex items-start gap-3">
                  <SidebarTrigger variant="outline" size="lg" className="p-4" />
                  <div>
                      <h1 className="text-xl font-semibold">Novo item do compendium</h1>
                      <p className="text-sm text-muted-foreground">
                          Preencha os campos e salve para criar um novo registro.
                      </p>
                  </div>
              </div>
      </header>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border bg-card p-4">
        <CompendiumForm
          submitLabel={saving ? "Salvando..." : "Salvar"}
          loading={saving}
          onCancel={() => router.push("/compendium")}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}
