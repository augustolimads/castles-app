'use client';

import { syncedLocalStorage } from '@/lib/sync';
import { useEffect, useState } from 'react';
import type { Item } from '../itens/use-items';

export interface ContainerItem extends Item {
  quantity: number;
}

export interface Container {
  id: string;
  name: string;
  items: ContainerItem[];
  isExpanded: boolean;
    maxCapacity?: number;
}

const CONTAINERS_STORAGE_KEY = 'containers-data';

export function useContainers() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar do localStorage
  useEffect(() => {
    const stored = syncedLocalStorage.getItem(CONTAINERS_STORAGE_KEY);
    if (stored) {
      try {
        setContainers(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading containers:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage (com sincronização)
  useEffect(() => {
    if (isLoaded) {
      syncedLocalStorage.setItem(CONTAINERS_STORAGE_KEY, JSON.stringify(containers));
    }
  }, [containers, isLoaded]);

  const createContainer = (name: string) => {
    const newContainer: Container = {
      id: `container-${Date.now()}`,
      name,
      items: [],
      isExpanded: true,
    };
    setContainers(prev => [...prev, newContainer]);
  };

  const deleteContainer = (containerId: string) => {
    setContainers(prev => prev.filter(c => c.id !== containerId));
  };

  const renameContainer = (containerId: string, newName: string) => {
    setContainers(prev =>
      prev.map(c => (c.id === containerId ? { ...c, name: newName } : c))
    );
  };

  const toggleContainer = (containerId: string) => {
    setContainers(prev =>
      prev.map(c => (c.id === containerId ? { ...c, isExpanded: !c.isExpanded } : c))
    );
  };

    const updateMaxCapacity = (containerId: string, maxCapacity: number) => {
        setContainers(prev =>
            prev.map(c => (c.id === containerId ? { ...c, maxCapacity } : c))
        );
    };

  const addItemToContainer = (containerId: string, item: Item) => {
    setContainers(prev =>
      prev.map(c => {
        if (c.id !== containerId) return c;
        
        const existingItem = c.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            ...c,
            items: c.items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        
        return {
          ...c,
          items: [...c.items, { ...item, quantity: 1 }],
        };
      })
    );
  };

  const removeItemFromContainer = (containerId: string, itemId: string) => {
    setContainers(prev =>
      prev.map(c =>
        c.id === containerId
          ? { ...c, items: c.items.filter(i => i.id !== itemId) }
          : c
      )
    );
  };

  const updateItemQuantity = (containerId: string, itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromContainer(containerId, itemId);
      return;
    }
    
    setContainers(prev =>
      prev.map(c =>
        c.id === containerId
          ? {
              ...c,
              items: c.items.map(i =>
                i.id === itemId ? { ...i, quantity } : i
              ),
            }
          : c
      )
    );
  };

  const moveItemBetweenContainers = (
    fromContainerId: string,
    toContainerId: string,
    itemId: string
  ) => {
    setContainers(prev => {
      const fromContainer = prev.find(c => c.id === fromContainerId);
      const item = fromContainer?.items.find(i => i.id === itemId);
      
      if (!item) return prev;

      return prev.map(c => {
        if (c.id === fromContainerId) {
          return { ...c, items: c.items.filter(i => i.id !== itemId) };
        }
        if (c.id === toContainerId) {
          const existingItem = c.items.find(i => i.id === itemId);
          if (existingItem) {
            return {
              ...c,
              items: c.items.map(i =>
                i.id === itemId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { ...c, items: [...c.items, item] };
        }
        return c;
      });
    });
  };

  const reorderContainers = (fromIndex: number, toIndex: number) => {
    setContainers(prev => {
      const newContainers = [...prev];
      const [removed] = newContainers.splice(fromIndex, 1);
      newContainers.splice(toIndex, 0, removed);
      return newContainers;
    });
  };

  const getTotalWeight = (containerId: string): number => {
    const container = containers.find(c => c.id === containerId);
    if (!container) return 0;
    
    return container.items.reduce((total, item) => {
      const weight = item.ev || 0;
      return total + weight * item.quantity;
    }, 0);
  };

  const getTotalPrice = (containerId: string): number => {
    const container = containers.find(c => c.id === containerId);
    if (!container) return 0;
    
    return container.items.reduce((total, item) => {
      return total + item.gold * item.quantity;
    }, 0);
  };

    const addCustomItemToContainer = (containerId: string, item: Item, quantity: number) => {
        setContainers(prev =>
            prev.map(c => {
                if (c.id !== containerId) return c;

                const existingItem = c.items.find(i => i.id === item.id);
                if (existingItem) {
                    return {
                        ...c,
                        items: c.items.map(i =>
                            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
                        ),
                    };
                }

                return {
                    ...c,
                    items: [...c.items, { ...item, quantity }],
                };
            })
        );
    };

  return {
    containers,
    isLoaded,
    createContainer,
    deleteContainer,
    renameContainer,
    toggleContainer,
      updateMaxCapacity,
    addItemToContainer,
      addCustomItemToContainer,
    removeItemFromContainer,
    updateItemQuantity,
    moveItemBetweenContainers,
    reorderContainers,
    getTotalWeight,
    getTotalPrice,
  };
}
