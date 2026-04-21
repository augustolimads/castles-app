import { create } from 'zustand';

interface IWeapon {
    id: string;
    name: string;
    bth: string;
    dmg: string;
}

interface IItem {
    id: string;
    qtd: number;
    name: string;
    description: string;
    ev: number;
}

interface InventoryState {
    weapons: IWeapon[];
    items: IItem[];
    updateInventory: (updates: Partial<{ weapons: IWeapon[]; items: IItem[] }>) => void;
    setInventory: (inventory: { weapons: IWeapon[]; items: IItem[] }) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
    weapons: [],
    items: [],
    updateInventory: (updates) => set((state) => ({ ...state, ...updates })),
    setInventory: (inventory) => set(inventory),
}));

interface WeaponsState {
    isDeleteMode: boolean;
    setDeleteMode: (value: boolean) => void;
}

export const useWeaponsStore = create<WeaponsState>((set) => ({
    isDeleteMode: false,
    setDeleteMode: (value) => set({ isDeleteMode: value }),
}));

export function setDeleteWeapons(value: boolean) {
    useWeaponsStore.getState().setDeleteMode(value);
}