'use client';

import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/use-pagination";
import { FileText, Skull, Users } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { SheetType } from '../../types';
import { useSheets } from '../../use-sheets';
import { CreateSheetDialog } from './create-sheet-dialog';
import { SheetCard } from './sheet-card';
import { SidebarTrigger } from "@/components/ui/sidebar";

const sheetTypes = [
  { id: 'personagem' as const, label: 'Personagens', icon: FileText },
  { id: 'npc' as const, label: 'NPCs', icon: Users },
  { id: 'monstro' as const, label: 'Monstros', icon: Skull },
];

export function SheetsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const typeParam = searchParams.get('type') as SheetType | null;

  const [activeType, setActiveType] = useState<SheetType>(
    typeParam && ['personagem', 'npc', 'monstro'].includes(typeParam)
      ? typeParam
      : 'personagem'
  );

  const { sheets, addSheet, deleteSheet } = useSheets(activeType);

  const sortedSheets = useMemo(() => {
    return [...sheets].sort((a, b) => b.createdAt - a.createdAt);
  }, [sheets]);

  const {
    currentData,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage: originalGoToPage,
    goToNextPage: originalGoToNextPage,
    goToPreviousPage: originalGoToPreviousPage,
  } = usePagination({
    data: sortedSheets,
    itemsPerPage: 12,
    initialPage,
  });

  const updateSearchParams = useCallback((updates: { page?: number; type?: SheetType }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.page !== undefined) {
      if (updates.page === 1) {
        params.delete('page');
      } else {
        params.set('page', updates.page.toString());
      }
    }

    if (updates.type !== undefined) {
      params.set('type', updates.type);
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleTypeChange = (type: string) => {
    setActiveType(type as SheetType);
    updateSearchParams({ type: type as SheetType, page: 1 });
  };

  const goToPage = useCallback((page: number) => {
    originalGoToPage(page);
    updateSearchParams({ page });
  }, [originalGoToPage, updateSearchParams]);

  const goToNextPage = useCallback(() => {
    const nextPage = currentPage + 1;
    originalGoToNextPage();
    updateSearchParams({ page: nextPage });
  }, [originalGoToNextPage, currentPage, updateSearchParams]);

  const goToPreviousPage = useCallback(() => {
    const prevPage = currentPage - 1;
    originalGoToPreviousPage();
    updateSearchParams({ page: prevPage });
  }, [originalGoToPreviousPage, currentPage, updateSearchParams]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-2 bg-secondary py-4 px-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger variant='outline' size='lg' className="p-4" />
            <h1 className="text-2xl font-bold">Fichas de Personagens</h1>
          </div>
          <CreateSheetDialog type={activeType} onCreateSheet={addSheet} />
        </div>

        <Tabs value={activeType} onValueChange={handleTypeChange}>
          <TabsList className="grid w-full grid-cols-3 h-auto">
            {sheetTypes.map(type => {
              const Icon = type.icon;
              const count = sheets.length;
              return (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className="flex items-center gap-2 py-3"
                >
                  <Icon size={18} />
                  <span>{type.label}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {count}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {currentData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentData.map(sheet => (
              <SheetCard
                key={sheet.id}
                sheet={sheet}
                onDelete={deleteSheet}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-2">Nenhuma ficha cadastrada</p>
            <p className="text-sm">Clique em "Nova Ficha" para criar sua primeira ficha</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={goToPage}
            onNext={goToNextPage}
            onPrevious={goToPreviousPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        )}
      </div>
    </div>
  );
}
