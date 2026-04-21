import { create } from 'zustand';
import { useCharacterStore } from './stores/character';

interface AppChangesState {
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (value: boolean) => void;
}

export const useAppChangesStore = create<AppChangesState>((set) => ({
    hasUnsavedChanges: false,
    setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
}));

export function handleInputChange(newValue?: boolean) {
    const character = useCharacterStore.getState();
    if (!character.name) {
        useAppChangesStore.getState().setHasUnsavedChanges(newValue ?? true);
    }
}

export function handleBeforeUnload(event: BeforeUnloadEvent) {
    const appChanges = useAppChangesStore.getState();
    if (appChanges.hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
    }
}