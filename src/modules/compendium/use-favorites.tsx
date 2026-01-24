'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type FavoriteItem = {
  id: string;
  type: string;
  name: string;
  effect: string;
  gold?: number | undefined;
  ev?: number | null | undefined;
  obs: string;
  tags: string;
  proficience: string[];
  icon: string;
  image: string;
};

type FavoritesContextType = {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  clearFavorites: () => void;
  totalItems: number;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([]);

  // Carregar do localStorage ao inicializar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('compendium-favorites');
    if (savedFavorites) {
      try {
        setItems(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que items mudar
  useEffect(() => {
    localStorage.setItem('compendium-favorites', JSON.stringify(items));
  }, [items]);

  const addFavorite = (newItem: FavoriteItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        return [...currentItems, newItem];
      }
      
      return currentItems;
    });
  };

  const removeFavorite = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return items.some(item => item.id === id);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const clearFavorites = () => {
    setItems([]);
  };

  const totalItems = items.length;

  return (
    <FavoritesContext.Provider value={{
      items,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      totalItems,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
