'use client';

import { useEffect, useState } from 'react';
import { isMigrationNeeded, migrateCharacterStorageFormat } from './migration';

/**
 * Component that handles automatic migration of localStorage format on app boot
 * Migrates from old fragmented format to new unified format
 */
export function StorageMigration() {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed' | 'error'>('idle');

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check if migration is needed
    setMigrationStatus('checking');
    
    const needsMigration = isMigrationNeeded();
    
    if (!needsMigration) {
      console.log('[StorageMigration] No migration needed');
      setMigrationStatus('completed');
      return;
    }

    // Run migration
    console.log('[StorageMigration] Migration needed, starting...');
    setMigrationStatus('migrating');

    try {
      const result = migrateCharacterStorageFormat();

      if (result.success) {
        console.log(`[StorageMigration] Migration completed successfully! Migrated ${result.migratedCount} characters`);
        setMigrationStatus('completed');
      } else {
        console.error('[StorageMigration] Migration completed with errors:', result.errors);
        setMigrationStatus('error');
      }
    } catch (error) {
      console.error('[StorageMigration] Migration failed:', error);
      setMigrationStatus('error');
    }
  }, []);

  // Don't render anything - migration happens silently in the background
  // In the future, could show a loading indicator or toast notification
  if (migrationStatus === 'migrating') {
    // Optional: show loading indicator
    // return <div>Migrando dados...</div>;
  }

  return null;
}
