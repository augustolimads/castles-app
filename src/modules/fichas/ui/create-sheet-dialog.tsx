'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { SheetType } from '../types';

interface CreateSheetDialogProps {
  type: SheetType;
  onCreateSheet: (sheet: {
    type: SheetType;
    portrait: string;
    name: string;
    race: string;
    class: string;
    level: number;
    bg: string;
  }) => void;
}

const typeLabels = {
  personagem: 'Personagem',
  npc: 'NPC',
  monstro: 'Monstro',
};

export function CreateSheetDialog({ type, onCreateSheet }: CreateSheetDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    portrait: '',
    bg: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onCreateSheet({
      type,
      ...formData,
    });

    // Reset form
    setFormData({
      name: '',
      race: '',
      class: '',
      level: 1,
      portrait: '',
      bg: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Ficha de {typeLabels[type]}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Ficha de {typeLabels[type]}</DialogTitle>
            <DialogDescription>
              Preencha os dados básicos da ficha. Você poderá editar detalhes depois.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do personagem"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="race">Raça</Label>
                <Input
                  id="race"
                  value={formData.race}
                  onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                  placeholder="Ex: Humano, Elfo"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="class">Classe</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="Ex: Guerreiro"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="level">Nível</Label>
              <Input
                id="level"
                type="number"
                min="1"
                max="20"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: Number.parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="portrait">URL do Retrato</Label>
              <Input
                id="portrait"
                value={formData.portrait}
                onChange={(e) => setFormData({ ...formData, portrait: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bg">URL do Background</Label>
              <Input
                id="bg"
                value={formData.bg}
                onChange={(e) => setFormData({ ...formData, bg: e.target.value })}
                placeholder="https://exemplo.com/background.jpg"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Ficha</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
