'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Item } from '@/modules/itens/use-items';
import { useState } from 'react';

interface CustomItemModalProps {
  containerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (containerId: string, item: Item, quantity: number) => void;
}

export function CustomItemModal({
  containerId,
  open,
  onOpenChange,
  onAddItem,
}: CustomItemModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [gold, setGold] = useState('');
  const [ev, setEv] = useState('');
  const [effect, setEffect] = useState('');
  const [quantity, setQuantity] = useState('1');

  const resetForm = () => {
    setName('');
    setType('');
    setGold('');
    setEv('');
    setEffect('');
    setQuantity('1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !type.trim()) {
      alert('Nome e tipo são obrigatórios');
      return;
    }

    const customItem: Item = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      type: type.trim(),
      gold: Number.parseFloat(gold) || 0,
      ev: ev.trim() ? Number.parseFloat(ev) : null,
      effect: effect.trim(),
      obs: '',
      proficience: [],
      icon: '',
      tags: 'customizado',
      image: '',
    };

    const itemQuantity = Number.parseInt(quantity) || 1;
    onAddItem(containerId, customItem, itemQuantity);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Item Customizado</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Espada Mágica"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              Tipo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="type"
              placeholder="Ex: Arma, Armadura, Poção, etc"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gold">Preço (PO)</Label>
              <Input
                id="gold"
                type="number"
                step="0.01"
                placeholder="0"
                value={gold}
                onChange={(e) => setGold(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ev">Peso (EV)</Label>
              <Input
                id="ev"
                type="number"
                step="0.01"
                placeholder="0"
                value={ev}
                onChange={(e) => setEv(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="effect">Descrição / Efeito</Label>
            <Textarea
              id="effect"
              placeholder="Descreva o item e seus efeitos..."
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Adicionar Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
