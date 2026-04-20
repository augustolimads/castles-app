'use client';

import { useEffect, useState } from 'react';
import type { CharacterSheet, SheetType } from './types';

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
  localStorage.setItem(SHEETS_STORAGE_KEY, JSON.stringify(sheets));
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
    const allSheets = getStoredSheets();
    saveSheets([...allSheets, newSheet]);
  };

  const deleteSheet = (id: string) => {
    const allSheets = getStoredSheets();
    saveSheets(allSheets.filter(sheet => sheet.id !== id));
  };

  const updateSheet = (id: string, updates: Partial<CharacterSheet>) => {
    const allSheets = getStoredSheets();
    const updated = allSheets.map(sheet => 
      sheet.id === id ? { ...sheet, ...updates } : sheet
    );
    saveSheets(updated);
  };

  return {
    sheets,
    addSheet,
    deleteSheet,
    updateSheet,
  };
}

export { SHEETS_UPDATED_EVENT };
