'use client';

import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';
import { Coins, GripVertical, Minus, Plus, Scale, Trash2 } from 'lucide-react';
import type { ContainerItem as ContainerItemType } from '../use-containers';

interface ContainerItemProps {
  item: ContainerItemType;
  containerId: string;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function ContainerItem({
  item,
  containerId,
  onRemove,
  onUpdateQuantity,
}: ContainerItemProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation(); // Impede que o evento propague para o container pai
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ fromContainerId: containerId, itemId: item.id })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const totalWeight = (item.ev || 0) * item.quantity;
  const totalPrice = item.gold * item.quantity;

  return (
    // biome-ignore lint: draggable item
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-accent/30 hover:bg-accent/50 rounded p-2 border border-border/50 cursor-move transition-colors"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{item.name}</div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            className="h-6 w-6 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>

          <span className="text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            className="h-6 w-6 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="h-6 w-6 p-0 text-destructive hover:text-destructive ml-1"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="items-center gap-3 text-xs text-muted-foreground mt-1 flex">
        <span className="capitalize">{item.type}</span>
        {item.ev !== null && (
          <span className="flex items-center gap-1">
            <Scale className="w-3 h-3" />
            {formatNumber(totalWeight)} EV
          </span>
        )}
        <span className="flex items-center gap-1">
          <Coins className="w-3 h-3 text-yellow-600" />
          {formatNumber(totalPrice)} PO
        </span>
      </div>

      {item.effect && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {item.effect}
        </p>
      )}
    </div>
  );
}
