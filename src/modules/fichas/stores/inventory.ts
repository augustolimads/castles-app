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

type ItemClassification = 'expert' | 'greater expert' | 'magica' | 'prateada';

interface IItem {
    id: string;
    qtd: number;
    name: string;
    description: string;
    ev: number;
    icon?: string;
    slot?: number;
    itemType?: string;
    attackBonus?: number;
    customDamage?: string;
    customArmorClass?: number;
    classification?: ItemClassification;
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

interface ItemsState {
    isDeleteMode: boolean;
    setDeleteMode: (value: boolean) => void;
}

export const useItemsStore = create<ItemsState>((set) => ({
    isDeleteMode: false,
    setDeleteMode: (value) => set({ isDeleteMode: value }),
}));

export function setDeleteItems(value: boolean) {
    useItemsStore.getState().setDeleteMode(value);
}