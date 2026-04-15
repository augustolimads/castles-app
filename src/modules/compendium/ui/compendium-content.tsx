'use client';

import { Suspense } from 'react';
import { FavoritesProvider } from '../use-favorites';
import type { Monster } from '../use-monsters';
import { FavoritesSidebar } from './favorites-sidebar';
import { Grid } from './grid';
import { Header } from './header';

interface CompendiumContentProps {
  monsters: Monster[];
}

function CompendiumContentInner({ monsters }: CompendiumContentProps) {
  return (
    <FavoritesProvider>
      <Header />
      <div className="flex gap-6 min-h-screen">
        <div className="flex-1 min-w-0">
          <Grid monsters={monsters} itemsPerPage={20} />
        </div>
        <FavoritesSidebar />
      </div>
    </FavoritesProvider>
  );
}

export function CompendiumContent({ monsters }: CompendiumContentProps) {
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
      <CompendiumContentInner monsters={monsters} />
    </Suspense>
  );
}