'use client'

import { useEffect, useMemo, useRef, useState } from 'react';

interface UsePaginationProps {
  data: any[];
  itemsPerPage: number;
    initialPage?: number;
}

export function usePagination({ data, itemsPerPage, initialPage = 1 }: UsePaginationProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);
  const previousDataLength = useRef(data.length);

  // Sincronizar com mudanças
  useEffect(() => {
    // Se o tamanho dos dados mudou (filtros aplicados), resetar para página 1
    if (data.length !== previousDataLength.current) {
      previousDataLength.current = data.length;
      setCurrentPage(1);
    }
    // Caso contrário, sincronizar com o initialPage (navegação por URL)
    else if (initialPage !== currentPage) {
      setCurrentPage(initialPage);
    }
  }, [data.length, initialPage, currentPage]);

  const paginationInfo = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Se a página atual é maior que o total de páginas, volta para 1
    const safePage = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

    const startIndex = (safePage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentData = data.slice(startIndex, endIndex);

    return {
      currentData,
      currentPage: safePage,
      totalPages,
      totalItems,
      startIndex: startIndex + 1,
      endIndex,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1,
    };
  }, [data, itemsPerPage, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationInfo.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentPage(1);
  };

  return {
    ...paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    reset,
  };
}