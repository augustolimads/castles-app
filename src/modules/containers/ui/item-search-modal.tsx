'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Item } from '@/modules/itens/use-items';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ItemSearchModalProps {
  items: Item[];
  containerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (containerId: string, item: Item) => void;
}

export function ItemSearchModal({
  items,
  containerId,
  open,
  onOpenChange,
  onAddItem,
}: ItemSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    return items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          item.type.toLowerCase().includes(term) ||
          item.effect.toLowerCase().includes(term)
      )
      .slice(0, 10);
  }, [items, searchTerm]);

  const handleAddItem = (item: Item) => {
    onAddItem(containerId, item);
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buscar e Adicionar Itens</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar itens por nome, tipo ou efeito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {searchTerm && filteredItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum item encontrado com "{searchTerm}"
            </p>
          )}

          {filteredItems.length > 0 && (
            <div className="max-h-96 overflow-auto border rounded-lg">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0 flex items-center justify-between"
                >
                  <button
                    type="button"
                    className="flex-1 text-left"
                    onClick={() => handleAddItem(item)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type} • {item.gold} PO
                      {item.ev !== null && ` • ${item.ev} EV`}
                    </div>
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAddItem(item)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
