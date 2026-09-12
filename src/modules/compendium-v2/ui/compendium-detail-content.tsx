"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import type { CompendiumEntry } from "../domain/types";
import { CompendiumForm, type CompendiumFormValue } from "./compendium-form";

interface CompendiumDetailContentProps {
  id: string;
}

export function CompendiumDetailContent({ id }: CompendiumDetailContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [entry, setEntry] = useState<CompendiumEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = searchParams.get("edit") === "1";

  const markdownContent = useMemo(() => {
    if (!entry) return "";
    return entry.data &&
      typeof entry.data === "object" &&
      "content" in entry.data
      ? String((entry.data as { content?: string }).content ?? "")
      : "";
  }, [entry]);

  const loadEntry = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/compendium-v2/${id}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as
        | CompendiumEntry
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data ? data.error : "Falha ao carregar registro",
        );
      }

      setEntry(data as CompendiumEntry);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Erro inesperado";
      setError(message);
      setEntry(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadEntry();
  }, [loadEntry]);

  const toggleEdit = (next: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("edit", "1");
    else params.delete("edit");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const handleSave = async (value: CompendiumFormValue) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/compendium-v2/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      });

      const payload = (await response.json()) as
        | CompendiumEntry
        | { error?: string };

      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Falha ao salvar");
      }

      setEntry(payload as CompendiumEntry);
      toggleEdit(false);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Erro inesperado";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Deseja deletar este item do compendium?");
    if (!confirmed) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/compendium-v2/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Falha ao deletar");
      }

      router.push("/compendium");
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Erro inesperado";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando item...</div>
    );
  }

  if (!entry) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">
          {error ?? "Item não encontrado."}
        </p>
        <Button variant="outline" onClick={() => router.push("/compendium")}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isEditing && (
        <>
          <header className="rounded-lg border bg-secondary p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{entry.nome}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{entry.category}</Badge>
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/compendium")}
                >
                  Voltar
                </Button>
                <Button onClick={() => toggleEdit(true)}>Editar</Button>
              </div>
            </div>
          </header>

          {entry.thumbnail && (
            <div className="rounded-lg border bg-card p-3">
              <Image
                src={entry.thumbnail}
                alt={`Thumbnail de ${entry.nome}`}
                className="max-h-56 rounded object-contain"
                width={896}
                height={224}
              />
            </div>
          )}

          <article className="rounded-lg border bg-card p-4">
                      <div className="max-w-none text-sm leading-7 text-foreground sm:text-base">
                          <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeSanitize]}
                              components={{
                    h1: ({ ...props }) => (
                        <h1
                            {...props}
                            className="mb-4 border-b pb-2 text-3xl font-extrabold tracking-tight"
                        />
                    ),
                    h2: ({ ...props }) => (
                        <h2 {...props} className="mb-3 mt-8 text-2xl font-bold" />
                    ),
                    h3: ({ ...props }) => (
                        <h3
                            {...props}
                            className="mb-2 mt-6 text-xl font-semibold"
                        />
                    ),
                    p: ({ ...props }) => (
                        <p
                            {...props}
                            className="mb-4 leading-7 text-foreground/95"
                        />
                    ),
                    ul: ({ ...props }) => (
                        <ul
                            {...props}
                            className="mb-4 list-disc space-y-1 pl-6 marker:text-foreground"
                        />
                    ),
                    ol: ({ ...props }) => (
                        <ol
                            {...props}
                            className="mb-4 list-decimal space-y-1 pl-6 marker:font-semibold"
                        />
                    ),
                    li: ({ ...props }) => <li {...props} className="pl-1" />,
                    a: ({ ...props }) => (
                        <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium underline underline-offset-4"
                        />
                    ),
                    table: ({ ...props }) => (
                        <div className="mb-4 overflow-x-auto rounded border">
                            <table
                                {...props}
                                className="w-full border-collapse text-left"
                            />
                        </div>
                    ),
                    th: ({ ...props }) => (
                        <th
                            {...props}
                            className="border-b bg-muted/40 px-3 py-2 font-semibold"
                        />
                    ),
                    td: ({ ...props }) => (
                        <td {...props} className="border-b px-3 py-2 align-top" />
                    ),
                    code: ({ className, children, ...props }) => {
                        const isBlock = className?.includes("language-");

                      if (isBlock) {
                          return (
                              <code
                                  {...props}
                                  className={`${className} block rounded bg-muted px-3 py-2`}
                              >
                                  {children}
                              </code>
                          );
                      }

                                      return (
                                          <code {...props} className="rounded bg-muted px-1 py-0.5">
                                              {children}
                                          </code>
                                      );
                                  },
                              }}
                          >
                              {markdownContent}
                          </ReactMarkdown>
                      </div>
          </article>
        </>
      )}

      {isEditing && (
              <>
                  <header className="rounded-lg border bg-secondary p-4">
                      <div className="flex items-start gap-3">
                          <SidebarTrigger variant="outline" size="lg" className="p-4" />
                          <div>
                              <h1 className="text-xl font-semibold">
                                  Editar item do compendium
                              </h1>
                              <p className="text-sm text-muted-foreground">{entry.nome}</p>
                          </div>
                      </div>
                  </header>

                  <div className="rounded-lg border bg-card p-4">
                      <CompendiumForm
                          initialValue={entry}
                          submitLabel={saving ? "Salvando..." : "Salvar"}
                          loading={saving}
                          onSubmit={handleSave}
                          onDelete={handleDelete}
                          onCancel={() => toggleEdit(false)}
                      />
                  </div>
              </>
      )}
    </div>
  );
}
