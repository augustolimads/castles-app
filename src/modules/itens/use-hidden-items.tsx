'use client';

import { useCallback, useEffect, useState } from 'react';

const HIDDEN_ITEMS_KEY = 'hidden_items';
export const HIDDEN_ITEMS_UPDATED_EVENT = 'hidden-items-updated';

export function getHiddenItemIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(HIDDEN_ITEMS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function saveHiddenItemIds(ids: string[]): void {
  localStorage.setItem(HIDDEN_ITEMS_KEY, JSON.stringify(ids));
    // Defer dispatch so it never fires synchronously during another component's render
    setTimeout(() => window.dispatchEvent(new Event(HIDDEN_ITEMS_UPDATED_EVENT)), 0);
}

export function useHiddenItems() {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  useEffect(() => {
    setHiddenIds(getHiddenItemIds());
    const reload = () => setHiddenIds(getHiddenItemIds());
    window.addEventListener(HIDDEN_ITEMS_UPDATED_EVENT, reload);
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener(HIDDEN_ITEMS_UPDATED_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, []);

  const hideItem = useCallback((id: string) => {
    setHiddenIds(prev => {
      if (prev.includes(id)) return prev;
        return [...prev, id];
    });
      const current = getHiddenItemIds();
      if (!current.includes(id)) {
          saveHiddenItemIds([...current, id]);
      }
  }, []);

  const restoreItem = useCallback((id: string) => {
      setHiddenIds(prev => prev.filter(x => x !== id));
      const current = getHiddenItemIds();
      saveHiddenItemIds(current.filter(x => x !== id));
  }, []);


  return { hiddenIds, hideItem, restoreItem };
}
