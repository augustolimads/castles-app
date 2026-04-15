'use client';

import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useFavorites } from "../use-favorites";
import type { Monster } from "../use-monsters";
import { ItemHorizontalCard } from "./item-horizontal-card";

interface GridProps {
  monsters: Monster[];
  itemsPerPage?: number;
}

export function Grid({ monsters, itemsPerPage = 20 }: GridProps) {
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
    let filtered = monsters.filter(item => {
      // Filtro especial para favoritos
      if (categoryFilter === 'favorites') {
        const isFavorited = favoriteItems.some(fav => fav.id === item.id);
        if (!isFavorited) return false;
      } else {
        const matchesCategory = !categoryFilter || categoryFilter === 'all' || item.bioma?.toLowerCase().includes(categoryFilter.toLowerCase());
        if (!matchesCategory) return false;
      }

      const matchesSearch = !searchFilter ||
        item.nome.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (item.habilidades?.toLowerCase().includes(searchFilter.toLowerCase()) || false) ||
        (item.bioma?.toLowerCase().includes(searchFilter.toLowerCase()) || false) ||
        (item.ataques?.toLowerCase().includes(searchFilter.toLowerCase()) || false);

      return matchesSearch;
    });

    // Depois, ordenar os dados filtrados
    if (sortFilter) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortFilter) {
          case 'name_asc':
            return a.nome.localeCompare(b.nome);
          case 'name_desc':
            return b.nome.localeCompare(a.nome);
          case 'nivel_asc':
            return a.nivel.localeCompare(b.nivel);
          case 'nivel_desc':
            return b.nivel.localeCompare(a.nivel);
          case 'xp_asc':
            return (a.xp || '').localeCompare(b.xp || '');
          case 'xp_desc':
            return (b.xp || '').localeCompare(a.xp || '');
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [monsters, categoryFilter, searchFilter, sortFilter, favoriteItems]);

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
