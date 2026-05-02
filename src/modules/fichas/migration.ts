/**
 * Migration utility to convert old fragmented localStorage structure to unified format
 * 
 * OLD FORMAT (fragmented):
 * - castles-characters: Record<id, CharacterState> - ALL characters in one object
 * - castles-characters-spells-{id}: SpellsData per character
 * - castles-characters-inventory-{id}: InventoryData per character
 * 
 * NEW FORMAT (unified):
 * - castles-character-sheets: CharacterSheet[] (unchanged - metadata only)
 * - castles-character-data-{id}: CharacterData (character + spells + inventory + timestamp)
 */

import type { CharacterData, CharacterSheet, CharacterState, InventoryData, SpellsData } from './types';

const OLD_CHARACTERS_KEY = 'castles-characters';
const NEW_DATA_KEY_PREFIX = 'castles-character-data-';
const SHEETS_KEY = 'castles-character-sheets';
const MIGRATION_FLAG_KEY = 'storage-migration-completed';

/**
 * Check if migration is needed
 */
export function isMigrationNeeded(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Already migrated?
  if (localStorage.getItem(MIGRATION_FLAG_KEY) === 'true') {
    return false;
  }
  
  // Check if old format exists
  const oldCharacters = localStorage.getItem(OLD_CHARACTERS_KEY);
  return oldCharacters !== null && oldCharacters !== '{}';
}

/**
 * Migrate all character data from old format to new unified format
 */
export function migrateCharacterStorageFormat(): { success: boolean; migratedCount: number; errors: string[] } {
  if (typeof window === 'undefined') {
    return { success: false, migratedCount: 0, errors: ['Window is undefined'] };
  }

  console.log('[Migration] Starting character storage migration...');

  const errors: string[] = [];
  let migratedCount = 0;

  try {
    // Load old characters object
    const oldCharactersStr = localStorage.getItem(OLD_CHARACTERS_KEY);
    if (!oldCharactersStr || oldCharactersStr === '{}') {
      console.log('[Migration] No old data found, marking as completed');
      localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
      return { success: true, migratedCount: 0, errors: [] };
    }

    const oldCharacters: Record<string, CharacterState> = JSON.parse(oldCharactersStr);
    const characterIds = Object.keys(oldCharacters);

    console.log(`[Migration] Found ${characterIds.length} characters to migrate`);

    // Migrate each character
    for (const id of characterIds) {
      try {
        const character = oldCharacters[id];
        
        // Load spells (may not exist for all characters)
        let spells: SpellsData = {
          level: { lv0: 0, lv1: 0, lv2: 0, lv3: 0, lv4: 0, lv5: 0, lv6: 0, lv7: 0, lv8: 0, lv9: 0 },
          known: []
        };
        
        const spellsKey = `${OLD_CHARACTERS_KEY}-spells-${id}`;
        const spellsStr = localStorage.getItem(spellsKey);
        if (spellsStr) {
          try {
            spells = JSON.parse(spellsStr);
          } catch (err) {
            console.warn(`[Migration] Failed to parse spells for ${id}:`, err);
            errors.push(`Failed to parse spells for ${id}`);
          }
        }

        // Load inventory (may not exist for all characters)
        let inventory: InventoryData = {
          weapons: [],
          equipments: [],
          items: []
        };
        
        const inventoryKey = `${OLD_CHARACTERS_KEY}-inventory-${id}`;
        const inventoryStr = localStorage.getItem(inventoryKey);
        if (inventoryStr) {
          try {
            inventory = JSON.parse(inventoryStr);
            // Ensure all arrays exist (migration from older versions)
            inventory.weapons = inventory.weapons || [];
            inventory.equipments = inventory.equipments || [];
            inventory.items = inventory.items || [];
          } catch (err) {
            console.warn(`[Migration] Failed to parse inventory for ${id}:`, err);
            errors.push(`Failed to parse inventory for ${id}`);
          }
        }

        // Create unified data structure
        const unifiedData: CharacterData = {
          character,
          spells,
          inventory,
          lastModified: Date.now()
        };

        // Save to new format
        const newKey = `${NEW_DATA_KEY_PREFIX}${id}`;
        localStorage.setItem(newKey, JSON.stringify(unifiedData));
        
        console.log(`[Migration] Migrated character: ${id} (${character.name})`);
        migratedCount++;

      } catch (err) {
        const errorMsg = `Failed to migrate character ${id}: ${err}`;
        console.error(`[Migration] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Clean up old keys after successful migration
    if (migratedCount > 0) {
      console.log('[Migration] Cleaning up old storage keys...');
      
      // Remove old characters object
      localStorage.removeItem(OLD_CHARACTERS_KEY);
      
      // Remove old spells and inventory keys
      for (const id of characterIds) {
        localStorage.removeItem(`${OLD_CHARACTERS_KEY}-spells-${id}`);
        localStorage.removeItem(`${OLD_CHARACTERS_KEY}-inventory-${id}`);
      }
    }

    // Mark migration as completed
    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');

    console.log(`[Migration] Completed! Migrated ${migratedCount} characters with ${errors.length} errors`);
    
    return {
      success: errors.length === 0,
      migratedCount,
      errors
    };

  } catch (err) {
    const errorMsg = `Migration failed: ${err}`;
    console.error(`[Migration] ${errorMsg}`);
    return {
      success: false,
      migratedCount,
      errors: [...errors, errorMsg]
    };
  }
}

/**
 * Get list of all character IDs from sheets
 */
export function getCharacterIdsFromSheets(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const sheetsStr = localStorage.getItem(SHEETS_KEY);
    if (!sheetsStr) return [];
    
    const sheets: CharacterSheet[] = JSON.parse(sheetsStr);
    return sheets.map(sheet => sheet.id);
  } catch {
    return [];
  }
}

/**
 * Rollback migration (for testing or emergency recovery)
 * WARNING: This will restore old format from new format
 */
export function rollbackMigration(): { success: boolean; rolledBackCount: number } {
  if (typeof window === 'undefined') {
    return { success: false, rolledBackCount: 0 };
  }

  console.warn('[Migration] Rolling back to old format...');

  const characterIds = getCharacterIdsFromSheets();
  const oldCharacters: Record<string, CharacterState> = {};
  let rolledBackCount = 0;

  for (const id of characterIds) {
    try {
      const newKey = `${NEW_DATA_KEY_PREFIX}${id}`;
      const dataStr = localStorage.getItem(newKey);
      
      if (dataStr) {
        const data: CharacterData = JSON.parse(dataStr);
        
        // Restore to old format
        oldCharacters[id] = data.character;
        localStorage.setItem(`${OLD_CHARACTERS_KEY}-spells-${id}`, JSON.stringify(data.spells));
        localStorage.setItem(`${OLD_CHARACTERS_KEY}-inventory-${id}`, JSON.stringify(data.inventory));
        
        // Remove new format
        localStorage.removeItem(newKey);
        
        rolledBackCount++;
      }
    } catch (err) {
      console.error(`[Migration] Failed to rollback ${id}:`, err);
    }
  }

  // Restore old characters object
  if (rolledBackCount > 0) {
    localStorage.setItem(OLD_CHARACTERS_KEY, JSON.stringify(oldCharacters));
  }

  // Remove migration flag
  localStorage.removeItem(MIGRATION_FLAG_KEY);

  console.log(`[Migration] Rolled back ${rolledBackCount} characters`);
  
  return { success: true, rolledBackCount };
}
