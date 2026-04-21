import { create } from 'zustand';

interface ISpell {
    id: string;
    name: string;
    level: number;
    slots: number;
    description: string;
}

interface SpellsState {
    level: {
        lv0: number;
        lv1: number;
        lv2: number;
        lv3: number;
        lv4: number;
        lv5: number;
        lv6: number;
        lv7: number;
        lv8: number;
        lv9: number;
    };
    known: ISpell[];
    updateSpells: (updates: Partial<SpellsState>) => void;
    setSpells: (spells: SpellsState) => void;
}

const initialState: Omit<SpellsState, 'updateSpells' | 'setSpells'> = {
    level: {
        lv0: 0,
        lv1: 0,
        lv2: 0,
        lv3: 0,
        lv4: 0,
        lv5: 0,
        lv6: 0,
        lv7: 0,
        lv8: 0,
        lv9: 0,
    },
    known: [],
};

export const useSpellsStore = create<SpellsState>((set) => ({
    ...initialState,
    updateSpells: (updates) => set((state) => ({ ...state, ...updates })),
    setSpells: (spells) => set(spells),
}));