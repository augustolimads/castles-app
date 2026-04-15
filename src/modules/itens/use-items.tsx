'use client';

import { useEffect, useState } from 'react';

export interface Item {
  id: string;
  type: string;
  name: string;
  gold: number;
  ev: number | null;
  obs: string;
  effect: string;
  proficience: string[];
  icon: string;
  tags: string;
  image: string;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/items')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { items, loading, error };
}
