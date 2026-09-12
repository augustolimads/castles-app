"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import {
    createTemplateDocument,
    getTemplatesByCategory,
} from "../domain/templates";
import {
    COMPENDIUM_CATEGORIES,
    type CompendiumCategory,
    type CompendiumData,
    type CompendiumEntry,
    getMarkdownContent,
    parseTagsInput,
} from "../domain/types";
import { MarkdownEditor } from "./markdown-editor";

export interface CompendiumFormValue {
  nome: string;
  thumbnail: string | null;
  category: CompendiumCategory;
  tags: string[];
  data: CompendiumData;
}

interface CompendiumFormProps {
  initialValue?: Partial<CompendiumEntry>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (value: CompendiumFormValue) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}

export function CompendiumForm({
  initialValue,
  submitLabel,
  loading,
  onSubmit,
  onCancel,
  onDelete,
}: CompendiumFormProps) {
  const [nome, setNome] = useState(initialValue?.nome ?? "");
  const [thumbnail, setThumbnail] = useState(initialValue?.thumbnail ?? "");
  const [category, setCategory] = useState<CompendiumCategory>(
    initialValue?.category ?? "regras",
  );
  const [tagsInput, setTagsInput] = useState(
    (initialValue?.tags ?? []).join(", "),
  );
  const [markdown, setMarkdown] = useState(
    initialValue?.data
      ? getMarkdownContent(initialValue.data)
      : createTemplateDocument("regras"),
  );
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const templates = useMemo(() => getTemplatesByCategory(category), [category]);

  const handleCategoryChange = (value: string) => {
    setCategory(value as CompendiumCategory);
    if (!initialValue?.id) {
      setMarkdown(createTemplateDocument(value as CompendiumCategory));
      setTemplateId("");
    }
  };

  const handleApplyTemplate = (value: string) => {
    if (value === "none") {
      setTemplateId("");
      return;
    }

    setTemplateId(value);
    setMarkdown(createTemplateDocument(category, value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!nome.trim()) {
      setError("Nome é obrigatório.");
      return;
    }

    const payload: CompendiumFormValue = {
      nome: nome.trim(),
      thumbnail: thumbnail.trim() || null,
      category,
      tags: parseTagsInput(tagsInput),
      data: {
        version: 1,
        format: "markdown",
        content: markdown,
        template: templateId || undefined,
      },
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="compendium-nome">Nome</Label>
          <Input
            id="compendium-nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Nome do registro"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compendium-category-select">Categoria</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="compendium-category-select">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {COMPENDIUM_CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="compendium-thumbnail">Thumbnail (URL opcional)</Label>
          <Input
            id="compendium-thumbnail"
            value={thumbnail}
            onChange={(event) => setThumbnail(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="compendium-tags">Tags (separadas por vírgula)</Label>
          <Input
            id="compendium-tags"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            placeholder="undead, boss, dungeon"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="compendium-template">Template rápido</Label>
          <Select
            value={templateId || "none"}
            onValueChange={handleApplyTemplate}
          >
            <SelectTrigger id="compendium-template">
              <SelectValue placeholder="Selecione um template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem template</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <MarkdownEditor value={markdown} onChange={setMarkdown} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => void onDelete()}
            disabled={loading}
          >
            Deletar
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Voltar
        </Button>
        <Button type="submit" disabled={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
