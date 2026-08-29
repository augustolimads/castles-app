'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CharacterSheet } from '../../types';

interface SheetCardProps {
  sheet: CharacterSheet;
  onDelete: (id: string) => void;
  onDragStart: (sheetId: string) => void;
  onDragEnd: () => void;
}

export function SheetCard({
  sheet,
  onDelete,
  onDragStart,
  onDragEnd,
}: SheetCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/fichas/${sheet.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Deseja realmente excluir a ficha de ${sheet.name}?`)) {
      onDelete(sheet.id);
    }
  };

  return (
    <article
      draggable
      onDragStart={() => onDragStart(sheet.id)}
      onDragEnd={onDragEnd}
      className="rounded-lg border bg-card p-3 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCardClick}
          className="flex items-center gap-3 text-left"
        >
          <div
            className="h-12 w-12 shrink-0 rounded-md bg-cover bg-center border"
            style={{
              backgroundImage: `url(${sheet.portrait || '/placeholder-portrait.jpg'})`,
              backgroundColor: '#ccc'
            }}
          />
        </button>

        <div>
          <div className="">
            <p className="truncate text-sm font-semibold leading-tight w-37 md:w-auto">{sheet.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {sheet.race || 'Sem raça'} - {sheet.class || 'Sem classe'}
            </p>
          </div>

          <Badge variant="outline" className="h-6 shrink-0">
            Nv. {sheet.level}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            title="Excluir ficha"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </article>
  );
}
