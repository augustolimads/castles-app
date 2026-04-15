'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Item } from '@/modules/itens/use-items';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Container } from '../use-containers';

interface ItemSearchProps {
  items: Item[];
  containers: Container[];
  onAddItem: (containerId: string, item: Item) => void;
}

export function ItemSearch({ items, containers, onAddItem }: ItemSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return items
      .filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.effect.toLowerCase().includes(term)
      )
      .slice(0, 10);
  }, [items, searchTerm]);

  const handleAddItem = (item: Item) => {
    if (!selectedContainer) {
      alert('Selecione um container primeiro');
      return;
    }
    onAddItem(selectedContainer, item);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold">Buscar e Adicionar Itens</h2>
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar itens por nome, tipo ou efeito..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="pl-10"
          />
          
          {showResults && filteredItems.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-80 overflow-auto">
              {filteredItems.map(item => (
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

        <Select value={selectedContainer} onValueChange={setSelectedContainer}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione o container" />
          </SelectTrigger>
          <SelectContent>
            {containers.map(container => (
              <SelectItem key={container.id} value={container.id}>
                {container.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {searchTerm && filteredItems.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum item encontrado com "{searchTerm}"
        </p>
      )}
    </div>
  );
}
