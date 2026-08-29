'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useSheetGroups } from '../../use-sheet-groups';
import { useSheets } from '../../use-sheets';

interface GroupNavigationFooterProps {
  currentSheetId: string;
}

export function GroupNavigationFooter({ currentSheetId }: GroupNavigationFooterProps) {
  const router = useRouter();
  const { sheets } = useSheets();
  const { groups } = useSheetGroups();

  const sheetsById = useMemo(() => {
    return new Map(sheets.map((sheet) => [sheet.id, sheet]));
  }, [sheets]);

  const currentGroup = useMemo(() => {
    return groups.find((group) => group.sheetIds.includes(currentSheetId));
  }, [groups, currentSheetId]);

  const sameGroupSheets = useMemo(() => {
    if (!currentGroup) {
      const current = sheetsById.get(currentSheetId);
      return current ? [current] : [];
    }

    return currentGroup.sheetIds
      .map((sheetId) => sheetsById.get(sheetId))
      .filter((sheet): sheet is NonNullable<typeof sheet> => Boolean(sheet));
  }, [currentGroup, currentSheetId, sheetsById]);

  const handleGoToList = () => {
    router.push('/fichas');
  };

  const handleGoToSheet = (sheetId: string) => {
    if (sheetId === currentSheetId) return;
    router.push(`/fichas/${sheetId}`);
  };

  if (sameGroupSheets.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2">
        <Button type="button" variant="outline" size="sm" onClick={handleGoToList}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Grupos
        </Button>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1">
          {sameGroupSheets.map((sheet) => {
            const isActive = sheet.id === currentSheetId;

            return (
              <button
                key={sheet.id}
                type="button"
                onClick={() => handleGoToSheet(sheet.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-2 py-1 text-left transition-colors ${
                  isActive ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                aria-label={`Abrir ficha de ${sheet.name}`}
              >
                <Avatar size="sm">
                  <AvatarImage src={sheet.portrait} />
                  <AvatarFallback>{sheet.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="max-w-24 truncate text-xs font-medium">{sheet.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
