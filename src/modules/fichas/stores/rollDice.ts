import { create } from 'zustand';

interface RollDiceState {
    formula: string;
    setFormula: (formula: string) => void;
}

export const useRollDiceStore = create<RollDiceState>((set) => ({
    formula: '',
    setFormula: (formula) => set({ formula }),
}));

export function setRollDice(formula: string) {
    useRollDiceStore.getState().setFormula(formula);
}