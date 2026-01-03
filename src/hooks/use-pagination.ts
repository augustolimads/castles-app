'use client'

import { useEffect, useMemo, useState } from 'react';

interface UsePaginationProps {
  data: any[];
  itemsPerPage: number;
    initialPage?: number;
}

export function usePagination({ data, itemsPerPage, initialPage = 1 }: UsePaginationProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);

  // Reset para página 1 sempre que os dados mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

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