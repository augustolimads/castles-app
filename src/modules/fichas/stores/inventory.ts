import { create } from 'zustand';

interface IWeapon {
    id: string;
    name: string;
    bth: string;
    dmg: string;
    ev: number;
}

interface IEquipment {
    id: string;
    name: string;
    ac: number;
    ev: number;
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
    equipments: IEquipment[];
    items: IItem[];
    updateInventory: (updates: Partial<{ weapons: IWeapon[]; equipments: IEquipment[]; items: IItem[] }>) => void;
    setInventory: (inventory: { weapons: IWeapon[]; equipments: IEquipment[]; items: IItem[] }) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
    weapons: [],
    equipments: [],
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

interface EquipmentsState {
    isDeleteMode: boolean;
    setDeleteMode: (value: boolean) => void;
}

export const useEquipmentsStore = create<EquipmentsState>((set) => ({
    isDeleteMode: false,
    setDeleteMode: (value) => set({ isDeleteMode: value }),
}));

export function setDeleteEquipments(value: boolean) {
    useEquipmentsStore.getState().setDeleteMode(value);
}