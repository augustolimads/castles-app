import type { CartItem } from '@/modules/itens/use-cart';

export type CartKit = {
  id: string;
  name: string;
  createdAt: string;
  items: CartItem[];
  totalGold: number;
  totalItems: number;
};

export const CART_KITS_STORAGE_KEY = 'cart-kits';
export const CART_KITS_UPDATED_EVENT = 'cart-kits-updated';

function parseKits(value: string | null): CartKit[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as CartKit[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function getSavedCartKits(): CartKit[] {
  if (typeof window === 'undefined') {
    return [];
  }

  return parseKits(localStorage.getItem(CART_KITS_STORAGE_KEY));
}

export function saveCartKit(items: CartItem[], name?: string): CartKit | null {
  if (typeof window === 'undefined' || items.length === 0) {
    return null;
  }

  const now = new Date();
  const totalGold = Number(
    items.reduce((sum, item) => sum + (item.gold || 0) * item.quantity, 0).toFixed(2)
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const newKit: CartKit = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name?.trim() || `Kit ${now.toLocaleString('pt-BR')}`,
    createdAt: now.toISOString(),
    items: items.map(item => ({ ...item })),
    totalGold,
    totalItems,
  };

  const currentKits = getSavedCartKits();
  const nextKits = [newKit, ...currentKits];

  localStorage.setItem(CART_KITS_STORAGE_KEY, JSON.stringify(nextKits));
  window.dispatchEvent(new CustomEvent(CART_KITS_UPDATED_EVENT));

  return newKit;
}

export function deleteSavedCartKit(kitId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const currentKits = getSavedCartKits();
  const nextKits = currentKits.filter(kit => kit.id !== kitId);

  localStorage.setItem(CART_KITS_STORAGE_KEY, JSON.stringify(nextKits));
  window.dispatchEvent(new CustomEvent(CART_KITS_UPDATED_EVENT));
}
