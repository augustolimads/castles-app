'use client';

import { CartSidebar } from '@/modules/itens/ui/cart-sidebar';
import { KitsGrid } from '@/modules/itens/ui/kits-grid';
import { CartProvider } from '@/modules/itens/use-cart';
import { Suspense, useState } from 'react';
import type { Item } from '../use-items';
import { Grid } from './grid';
import { Header } from './header';
import { TrashGrid } from './trash-grid';

interface MarketContentProps {
  items: Item[];
}

function MarketContentInner({ items }: MarketContentProps) {
  const [activeView, setActiveView] = useState<'items' | 'kits' | 'trash'>('items');

  return (
    <CartProvider>
      <Header activeView={activeView} onSetView={setActiveView} />
      <div className="flex gap-6 min-h-screen">
        <div className="flex-1 min-w-0">
          {activeView === 'kits' ? <KitsGrid /> : activeView === 'trash' ? <TrashGrid items={items} /> : <Grid items={items} itemsPerPage={20} />}
        </div>
        <CartSidebar />
      </div>
    </CartProvider>
  );
}

export function MarketContent({ items }: MarketContentProps) {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="sticky top-2 left-0 right-0 bg-secondary flex items-center justify-between py-2 px-2 border rounded-lg">
          <div className="w-4/12 h-9 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
            <div className="w-10 h-9 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="py-4 grid grid-cols lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((item) => (
            <div key={`skeleton-${item}`} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <MarketContentInner items={items} />
    </Suspense>
  );
}