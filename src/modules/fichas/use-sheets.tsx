'use client';

import { syncedLocalStorage } from '@/lib/sync';
import { useEffect, useState } from 'react';
import { createNewCharacter, deleteCharacterFromStorage, saveCharacterToStorage } from './stores/character';
import type { CharacterSheet, SheetType } from './types';
import { assignSheetToDefaultGroup, removeSheetFromAllGroups } from './use-sheet-groups';

const SHEETS_STORAGE_KEY = 'castles-character-sheets';
const SHEETS_UPDATED_EVENT = 'sheets-updated';

function getStoredSheets(): CharacterSheet[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(SHEETS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveSheets(sheets: CharacterSheet[]) {
  if (typeof window === 'undefined') return;
  // Usar syncedLocalStorage para que, quando cloud sync estiver ativa,
  // a lista de fichas (metadados) também seja sincronizada entre dispositivos.
  syncedLocalStorage.setItem(SHEETS_STORAGE_KEY, JSON.stringify(sheets));
  window.dispatchEvent(new Event(SHEETS_UPDATED_EVENT));
  window.dispatchEvent(new Event('storage'));
}

export function useSheets(filterType?: SheetType) {
  const [sheets, setSheets] = useState<CharacterSheet[]>([]);

  useEffect(() => {
    const loadSheets = () => {
      const allSheets = getStoredSheets();
      const filtered = filterType 
        ? allSheets.filter(sheet => sheet.type === filterType)
        : allSheets;
      setSheets(filtered);
    };

    loadSheets();

    const handleUpdate = () => loadSheets();
    window.addEventListener(SHEETS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(SHEETS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [filterType]);

  const addSheet = (sheet: Omit<CharacterSheet, 'id' | 'createdAt'>) => {
    const newSheet: CharacterSheet = {
      ...sheet,
      id: `sheet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };

    // Salvar o sheet na lista
    const allSheets = getStoredSheets();
    saveSheets([...allSheets, newSheet]);
    assignSheetToDefaultGroup(newSheet.id);

    // Criar o character completo no store com dados básicos
    const newCharacter = createNewCharacter({
      id: newSheet.id,
      name: sheet.name,
      race: sheet.race,
      charClass: sheet.class,
      level: sheet.level,
      portrait: sheet.portrait,
    });

    // Salvar o character completo no formato unificado (character + spells + inventory)
    // saveCharacterToStorage agora salva tudo em uma única entrada: castles-character-data-{id}
    saveCharacterToStorage(newCharacter, {
      level: { lv0: 0, lv1: 0, lv2: 0, lv3: 0, lv4: 0, lv5: 0, lv6: 0, lv7: 0, lv8: 0, lv9: 0 },
      known: []
    }, {
      weapons: [],
      equipments: [],
      items: []
    });

    return newSheet.id;
  };

  const deleteSheet = (id: string) => {
    const allSheets = getStoredSheets();
    saveSheets(allSheets.filter(sheet => sheet.id !== id));
    removeSheetFromAllGroups(id);

    // Deletar o character correspondente (formato unificado - uma única entrada)
    deleteCharacterFromStorage(id);
  };

  const updateSheet = (id: string, updates: Partial<CharacterSheet>) => {
    const allSheets = getStoredSheets();
    const updated = allSheets.map(sheet => 
      sheet.id === id ? { ...sheet, ...updates } : sheet
    );
    saveSheets(updated);

    // TODO: Se necessário, atualizar também o character correspondente
  };

  return {
    sheets,
    addSheet,
    deleteSheet,
    updateSheet,
  };
}

export { SHEETS_UPDATED_EVENT };
