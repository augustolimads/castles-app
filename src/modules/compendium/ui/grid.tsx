'use client';

import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { items } from "../items";
import { useFavorites } from "../use-favorites";
import { ItemHorizontalCard } from "./item-horizontal-card";

interface GridProps {
  itemsPerPage?: number;
}

export function Grid({ itemsPerPage = 20 }: GridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { items: favoriteItems } = useFavorites();

  const initialPage = parseInt(searchParams.get('page') ?? '1', 10);
  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';
  const sortFilter = searchParams.get('sort') || '';

  // Filtrar e ordenar dados baseado nos searchParams
  const filteredAndSortedData = useMemo(() => {
    // Primeiro, filtrar os dados
    let filtered = items.filter(item => {
      // Filtro especial para favoritos
      if (categoryFilter === 'favorites') {
        const isFavorited = favoriteItems.some(fav => fav.id === item.id);
        if (!isFavorited) return false;
      } else {
        const matchesCategory = !categoryFilter || categoryFilter === 'all' || item.type === categoryFilter;
        if (!matchesCategory) return false;
      }

      const matchesSearch = !searchFilter ||
        item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.effect.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.obs.toLowerCase().includes(searchFilter.toLowerCase());

      return matchesSearch;
    });

    // Depois, ordenar os dados filtrados
    if (sortFilter) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortFilter) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'gold_asc':
            return (a.gold || 0) - (b.gold || 0);
          case 'gold_desc':
            return (b.gold || 0) - (a.gold || 0);
          case 'ev_asc':
            return (a.ev || 0) - (b.ev || 0);
          case 'ev_desc':
            return (b.ev || 0) - (a.ev || 0);
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [categoryFilter, searchFilter, sortFilter, favoriteItems]);

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
    data: filteredAndSortedData,
    itemsPerPage,
    initialPage,
  });

  const updateSearchParams = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url, { scroll: false });
  }, [searchParams, pathname, router]);

  const goToPage = useCallback((page: number) => {
    originalGoToPage(page);
    updateSearchParams(page);
  }, [originalGoToPage, updateSearchParams]);

  const goToNextPage = useCallback(() => {
    const nextPage = currentPage + 1;
    originalGoToNextPage();
    updateSearchParams(nextPage);
  }, [originalGoToNextPage, currentPage, updateSearchParams]);

  const goToPreviousPage = useCallback(() => {
    const prevPage = currentPage - 1;
    originalGoToPreviousPage();
    updateSearchParams(prevPage);
  }, [originalGoToPreviousPage, currentPage, updateSearchParams]);

  return (
    <div className="space-y-4 flex-1 flex flex-col">
      <div className="py-4 grid grid-cols lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5 gap-4">
        {currentData.map(item => (
          <ItemHorizontalCard key={item.id} item={item} />
        ))}
      </div>

      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum item encontrado com os filtros aplicados.
        </div>
      )}

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
  )
}
