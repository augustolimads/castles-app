'use client';

import { syncedLocalStorage } from '@/lib/sync';
import { useEffect, useState } from 'react';

export interface SheetGroup {
  id: string;
  name: string;
  sheetIds: string[];
  createdAt: number;
}

const SHEET_GROUPS_STORAGE_KEY = 'castles-sheet-groups';
const SHEET_GROUPS_UPDATED_EVENT = 'sheet-groups-updated';
export const DEFAULT_SHEET_GROUP_NAME = 'sem nome';
export const DEFAULT_SHEET_GROUP_ID = 'sheet-group-default';

function getStoredGroups(): SheetGroup[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(SHEET_GROUPS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveGroups(groups: SheetGroup[]) {
  if (typeof window === 'undefined') return;

  syncedLocalStorage.setItem(SHEET_GROUPS_STORAGE_KEY, JSON.stringify(groups));
  window.dispatchEvent(new Event(SHEET_GROUPS_UPDATED_EVENT));
  window.dispatchEvent(new Event('storage'));
}

export function ensureDefaultSheetGroup(): SheetGroup {
  const groups = getStoredGroups();
  const existingDefault = groups.find((group) => group.id === DEFAULT_SHEET_GROUP_ID);

  if (existingDefault) {
    if (existingDefault.name !== DEFAULT_SHEET_GROUP_NAME) {
      const updated = groups.map((group) =>
        group.id === DEFAULT_SHEET_GROUP_ID
          ? { ...group, name: DEFAULT_SHEET_GROUP_NAME }
          : group
      );
      saveGroups(updated);
      return updated.find((group) => group.id === DEFAULT_SHEET_GROUP_ID) as SheetGroup;
    }
    return existingDefault;
  }

  const defaultGroup: SheetGroup = {
    id: DEFAULT_SHEET_GROUP_ID,
    name: DEFAULT_SHEET_GROUP_NAME,
    sheetIds: [],
    createdAt: Date.now(),
  };

  saveGroups([...groups, defaultGroup]);
  return defaultGroup;
}

export function removeSheetFromAllGroups(sheetId: string) {
  const groups = getStoredGroups();
  const updated = groups.map((group) => ({
    ...group,
    sheetIds: group.sheetIds.filter((id) => id !== sheetId),
  }));

  saveGroups(updated);
}

export function assignSheetToGroup(sheetId: string, targetGroupId: string) {
  const groups = getStoredGroups();
  if (groups.length === 0) {
    ensureDefaultSheetGroup();
    assignSheetToGroup(sheetId, targetGroupId);
    return;
  }

  const targetExists = groups.some((group) => group.id === targetGroupId);
  if (!targetExists) return;

  const updated = groups.map((group) => {
    const withoutSheet = group.sheetIds.filter((id) => id !== sheetId);

    if (group.id === targetGroupId) {
      return {
        ...group,
        sheetIds: [...withoutSheet, sheetId],
      };
    }

    return {
      ...group,
      sheetIds: withoutSheet,
    };
  });

  saveGroups(updated);
}

export function assignSheetToDefaultGroup(sheetId: string) {
  const defaultGroup = ensureDefaultSheetGroup();
  assignSheetToGroup(sheetId, defaultGroup.id);
}

export function useSheetGroups() {
  const [groups, setGroups] = useState<SheetGroup[]>([]);

  useEffect(() => {
    const loadGroups = () => {
      const stored = getStoredGroups();

      if (stored.length === 0) {
        const defaultGroup = ensureDefaultSheetGroup();
        setGroups([defaultGroup]);
        return;
      }

      const sorted = [...stored].sort((a, b) => a.createdAt - b.createdAt);
      setGroups(sorted);
    };

    loadGroups();

    const handleUpdate = () => loadGroups();
    window.addEventListener(SHEET_GROUPS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(SHEET_GROUPS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const createGroup = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const allGroups = getStoredGroups();
    const newGroup: SheetGroup = {
      id: `sheet-group-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: trimmed,
      sheetIds: [],
      createdAt: Date.now(),
    };

    saveGroups([...allGroups, newGroup]);
  };

  const renameGroup = (groupId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (groupId === DEFAULT_SHEET_GROUP_ID) return;

    const allGroups = getStoredGroups();
    const updated = allGroups.map((group) =>
      group.id === groupId ? { ...group, name: trimmed } : group
    );

    saveGroups(updated);
  };

  const deleteGroup = (groupId: string) => {
    if (groupId === DEFAULT_SHEET_GROUP_ID) return;

    const allGroups = getStoredGroups();
    const defaultGroup = ensureDefaultSheetGroup();

    const groupToDelete = allGroups.find((group) => group.id === groupId);
    if (!groupToDelete) return;

    const movedSheetIds = groupToDelete.sheetIds;

    const updated = allGroups
      .filter((group) => group.id !== groupId)
      .map((group) => {
        if (group.id !== defaultGroup.id) return group;

        const mergedIds = Array.from(new Set([...group.sheetIds, ...movedSheetIds]));
        return { ...group, sheetIds: mergedIds };
      });

    saveGroups(updated);
  };

  return {
    groups,
    createGroup,
    renameGroup,
    deleteGroup,
    assignSheetToGroup,
  };
}
