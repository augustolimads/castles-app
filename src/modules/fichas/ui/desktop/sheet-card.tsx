'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CharacterSheet } from '../../types';

interface SheetCardProps {
  sheet: CharacterSheet;
  onDelete: (id: string) => void;
  onDragStart: (sheetId: string) => void;
  onDragEnd: () => void;
}

const typeLabels = {
  personagem: 'Personagem',
  npc: 'NPC',
  monstro: 'Monstro',
};

const typeColors = {
  personagem: 'default',
  npc: 'secondary',
  monstro: 'destructive',
} as const;

export function SheetCard({
  sheet,
  onDelete,
  onDragStart,
  onDragEnd,
}: SheetCardProps) {
  const handleCardClick = () => {
    window.open(`/fichas/${sheet.id}`, '_blank');
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
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div
            className="h-12 w-12 shrink-0 rounded-md bg-cover bg-center border"
            style={{
              backgroundImage: `url(${sheet.portrait || '/placeholder-portrait.jpg'})`,
              backgroundColor: '#ccc'
            }}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{sheet.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {sheet.race || 'Sem raça'} - {sheet.class || 'Sem classe'}
            </p>
          </div>
        </button>

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

      <div className="mt-3 flex items-center gap-2">
        <Badge variant={typeColors[sheet.type]}>
          {typeLabels[sheet.type]}
        </Badge>
      </div>
    </article>
  );
}
