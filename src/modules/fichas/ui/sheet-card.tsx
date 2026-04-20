'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CharacterSheet } from '../types';

interface SheetCardProps {
  sheet: CharacterSheet;
  onDelete: (id: string) => void;
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

export function SheetCard({ sheet, onDelete }: SheetCardProps) {
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
    <button
      type="button"
      className="relative group cursor-pointer rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-all duration-200 text-left w-full"
      onClick={handleCardClick}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ backgroundImage: `url(${sheet.bg || '/placeholder-bg.jpg'})` }}
      />

      {/* Content */}
      <div className="relative p-4 flex gap-4">
        {/* Portrait */}
        <div className="shrink-0">
          <div 
            className="w-20 h-20 rounded-full bg-cover bg-center border-2 border-border"
            style={{ 
              backgroundImage: `url(${sheet.portrait || '/placeholder-portrait.jpg'})`,
              backgroundColor: '#ccc'
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg truncate">{sheet.name}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              title="Excluir ficha"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">Raça:</span>
              <span>{sheet.race}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Classe:</span>
              <span>{sheet.class}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Nível:</span>
              <Badge variant="outline" className="h-5">
                {sheet.level}
              </Badge>
            </div>
          </div>

          <div className="mt-2">
            <Badge variant={typeColors[sheet.type]}>
              {typeLabels[sheet.type]}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );
}
