'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useFavorites } from '../use-favorites';

export function FavoritesButton() {
  const { totalItems } = useFavorites();

  return (
    <Button variant="outline" title="Favoritos" className="cursor-pointer relative">
      <Star />
      {totalItems > 0 && (
        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}
