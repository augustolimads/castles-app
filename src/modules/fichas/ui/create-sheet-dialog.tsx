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
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
  }) => string; // Agora retorna o ID criado
}

const typeLabels = {
  personagem: 'Personagem',
  npc: 'NPC',
  monstro: 'Monstro',
};

export function CreateSheetDialog({ type, onCreateSheet }: CreateSheetDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    portrait: '',
  });

  const raceSuggestions = useMemo(() => [
    'Anão',
    'Elfo',
    'Gnomo',
    'Halfling',
    'Humano',
    'Meio-Elfo',
    'Meio-Orc',
  ], []);

  const classSuggestions = useMemo(() => [
    'Assassino',
    'Bárbaro',
    'Bardo',
    'Clérigo',
    'Druida',
    'Guerreiro',
    'Ilusionista',
    'Cavaleiro',
    'Monge',
    'Paladino',
    'Ranger',
    'Ladino',
    'Mago',
  ], []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newSheetId = onCreateSheet({
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
    });
    setOpen(false);

    // Redirecionar para a página de detalhes da ficha criada
    router.push(`/fichas/${newSheetId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Ficha de {typeLabels[type]}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
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
                  list="race-suggestions"
                />
                <datalist id="race-suggestions">
                  {raceSuggestions.map((race) => (
                    <option key={race} value={race} />
                  ))}
                </datalist>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="class">Classe</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="Ex: Guerreiro"
                  list="class-suggestions"
                />
                <datalist id="class-suggestions">
                  {classSuggestions.map((className) => (
                    <option key={className} value={className} />
                  ))}
                </datalist>
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
