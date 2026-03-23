'use client';

import { CartSidebar } from '@/modules/itens/ui/cart-sidebar';
import { KitsGrid } from '@/modules/itens/ui/kits-grid';
import { CartProvider } from '@/modules/itens/use-cart';
import { Suspense, useState } from 'react';
import { Grid } from './grid';
import { Header } from './header';

function MarketContentInner() {
  const [showKits, setShowKits] = useState(false);

  return (
      <CartProvider>
      <Header showKits={showKits} onToggleKits={() => setShowKits((prev) => !prev)} />
          <div className="flex gap-6 min-h-screen">
              <div className="flex-1 min-w-0">
          {showKits ? <KitsGrid /> : <Grid itemsPerPage={20} />}
              </div>
              <CartSidebar />
          </div>
      </CartProvider>
  );
}

export function MarketContent() {
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
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <MarketContentInner />
    </Suspense>
  );
}