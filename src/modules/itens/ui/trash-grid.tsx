'use client';

import { useHiddenItems } from '@/modules/itens/use-hidden-items';
import { useItems } from '@/modules/itens/use-items';
import { ItemHorizontalCard } from './item-horizontal-card';

export function TrashGrid() {
  const { items, loading } = useItems();
  const { hiddenIds, restoreItem } = useHiddenItems();
  const hiddenItems = items.filter(item => hiddenIds.includes(item.id));

  if (loading) {
    return (
      <div className="py-4 grid grid-cols lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5 gap-4">
        {Array.from({ length: 6 }).map((item) => (
          <div key={`skeleton-${item}`} className="h-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (hiddenItems.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Nenhum item oculto. Esconda itens clicando no ícone de lixeira nos cards.
      </div>
    );
  }

  return (
    <div className="py-4 grid grid-cols lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5 gap-4">
      {hiddenItems.map(item => (
        <ItemHorizontalCard
          key={item.id}
          item={item}
          onRestore={() => restoreItem(item.id)}
        />
      ))}
    </div>
  );
}
