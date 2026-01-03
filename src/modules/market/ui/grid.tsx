'use client';

import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { items } from "../items";
import { ItemHorizontalCard } from "./item-horizontal-card";

interface GridProps {
  itemsPerPage?: number;
}

export function Grid({ itemsPerPage = 12 }: GridProps) {
  const {
    currentData,
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination({
    data: items,
    itemsPerPage,
  });

  return (
    <div className="space-y-4">
      <div className="py-4 grid grid-cols lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentData.map(item => (
          <ItemHorizontalCard key={item.id} item={item} />
        ))}
      </div>

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
