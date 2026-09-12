"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Link, Table } from "lucide-react";
import { useRef } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  prefix: string,
  suffix: string,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.slice(start, end);
  const insertedText = `${prefix}${selectedText || "texto"}${suffix}`;

  const nextValue =
    textarea.value.slice(0, start) + insertedText + textarea.value.slice(end);

  const nextCursor = start + insertedText.length;

  return { nextValue, nextCursor };
}

const TABLE_SNIPPET = `\n| Coluna 1 | Coluna 2 |\n| --- | --- |\n| Valor A | Valor B |\n`;

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const applyFormat = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { nextValue, nextCursor } = wrapSelection(textarea, prefix, suffix);
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = nextCursor;
      textarea.selectionEnd = nextCursor;
    });
  };

  const insertTable = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const nextValue = `${textarea.value.slice(0, start)}${TABLE_SNIPPET}${textarea.value.slice(start)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + TABLE_SNIPPET.length;
      textarea.selectionEnd = start + TABLE_SNIPPET.length;
    });
  };

  return (
    <div className="space-y-2">
      <Label>Conteúdo (Markdown)</Label>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyFormat("**", "**")}
        >
          <Bold className="mr-1 h-4 w-4" />
          Negrito
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyFormat("*", "*")}
        >
          <Italic className="mr-1 h-4 w-4" />
          Itálico
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => applyFormat("[", "](https://)")}
        >
          <Link className="mr-1 h-4 w-4" />
          Link
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={insertTable}>
          <Table className="mr-1 h-4 w-4" />
          Tabela
        </Button>
      </div>

      <Textarea
        ref={textareaRef}
        className="min-h-72 font-mono"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="# Titulo\n\nDescreva seu conteúdo aqui..."
      />
    </div>
  );
}
