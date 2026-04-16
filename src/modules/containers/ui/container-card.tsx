'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';
import type { Item } from '@/modules/itens/use-items';
import {
    ChevronDown,
    ChevronRight,
    Coins,
    GripVertical,
    MoreVertical,
    Plus,
    Scale,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { Container } from '../use-containers';
import { ContainerItem } from './container-item';
import { CustomItemModal } from './custom-item-modal';
import { ItemSearchModal } from './item-search-modal';

interface ContainerCardProps {
  container: Container;
    items: Item[];
  totalWeight: number;
  totalPrice: number;
  onDelete: () => void;
  onRename: (name: string) => void;
  onToggle: () => void;
    onUpdateMaxCapacity: (maxCapacity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onMoveItem: (fromContainerId: string, toContainerId: string, itemId: string) => void;
    onAddItem: (containerId: string, item: Item) => void;
    onAddCustomItem: (containerId: string, item: Item, quantity: number) => void;
    onDragStart: () => void;
}

export function ContainerCard({
  container,
    items,
  totalWeight,
  totalPrice,
  onDelete,
  onRename,
  onToggle,
    onUpdateMaxCapacity,
  onRemoveItem,
  onUpdateQuantity,
  onMoveItem,
    onAddItem,
    onAddCustomItem,
    onDragStart,
}: ContainerCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(container.name);
    const [isEditingCapacity, setIsEditingCapacity] = useState(false);
    const [editCapacity, setEditCapacity] = useState(container.maxCapacity?.toString() || '');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);

  const handleRename = () => {
    if (editName.trim()) {
      onRename(editName.trim());
      setIsEditing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-primary');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-primary');
    
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      const { fromContainerId, itemId } = JSON.parse(data);
      if (fromContainerId !== container.id) {
        onMoveItem(fromContainerId, container.id, itemId);
      }
    }
  };

  return (
      <div className="bg-card border rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
          <div className={`p-4 bg-accent/50 ${container.isExpanded ? 'border-b' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
                  {/* biome-ignore lint: drag handle */}
                  <div
                      draggable
                      onDragStart={(e) => {
                          onDragStart();
                          e.stopPropagation();
                      }}
                      className="cursor-grab active:cursor-grabbing"
                  >
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>
          
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              onBlur={handleRename}
              className="h-8 flex-1"
              autoFocus
            />
          ) : (
                          <button
                              type="button"
                              onClick={() => setIsEditing(true)}
                              className="font-semibold flex-1 text-left hover:text-primary transition-colors"
                          >
                              {container.name}
                          </button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
          >
            {container.isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>

                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setIsSearchOpen(true)}>
                              <Search className="w-4 h-4" />
                              Buscar itens
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setIsCustomItemOpen(true)}>
                              <Plus className="w-4 h-4" />
                              Criar item customizado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={onDelete} variant="destructive">
                              <Trash2 className="w-4 h-4" />
                              Deletar container
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
        </div>

        {/* Totais */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Scale className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{formatNumber(totalWeight)}</span>
            <span className="text-muted-foreground">EV</span>
          </div>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                              {isEditingCapacity ? (
                                  <Input
                                      type="number"
                                      value={editCapacity}
                                      onChange={(e) => setEditCapacity(e.target.value)}
                                      onBlur={() => {
                                          const value = Number.parseFloat(editCapacity);
                                          if (!Number.isNaN(value) && value > 0) {
                                              onUpdateMaxCapacity(value);
                                          }
                                          setIsEditingCapacity(false);
                                      }}
                                      onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                              const value = Number.parseFloat(editCapacity);
                                              if (!Number.isNaN(value) && value > 0) {
                                                  onUpdateMaxCapacity(value);
                                              }
                                              setIsEditingCapacity(false);
                                          }
                                      }}
                                      className="h-6 w-16 px-1 text-xs"
                                      autoFocus
                                  />
                              ) : (
                                  <button
                                      type="button"
                                      onClick={() => setIsEditingCapacity(true)}
                                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                                  >
                                      <span className="text-muted-foreground">Capac.</span>
                                      <span className="font-medium">
                                          {container.maxCapacity ? formatNumber(container.maxCapacity) : '-'}
                                      </span>
                                  </button>
                              )}
                          </div>
                      </TooltipTrigger>
                      <TooltipContent>
                          <p>Capacidade</p>
                      </TooltipContent>
                  </Tooltip>
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">{formatNumber(totalPrice)}</span>
            <span className="text-muted-foreground">PO</span>
          </div>
          <div className="text-muted-foreground">
            {container.items.length} {container.items.length === 1 ? 'item' : 'itens'}
          </div>
        </div>
      </div>

      {/* Items List */}
      {container.isExpanded && (
              <section
          className="flex-1 overflow-y-auto max-h-96 p-2"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
          aria-label="Container items area"
        >
          {container.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Container vazio. Busque e adicione itens acima.
            </div>
          ) : (
            <div className="space-y-1">
              {container.items.map(item => (
                <ContainerItem
                  key={item.id}
                  item={item}
                  containerId={container.id}
                  onRemove={() => onRemoveItem(item.id)}
                  onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
                />
              ))}
            </div>
          )}
              </section>
      )}

          <ItemSearchModal
              items={items}
              containerId={container.id}
              open={isSearchOpen}
              onOpenChange={setIsSearchOpen}
              onAddItem={onAddItem}
          />

          <CustomItemModal
              containerId={container.id}
              open={isCustomItemOpen}
              onOpenChange={setIsCustomItemOpen}
              onAddItem={onAddCustomItem}
          />
    </div>
  );
}
