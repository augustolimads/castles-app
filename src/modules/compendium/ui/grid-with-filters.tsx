import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { useMemo, useState } from "react";
import { ItemHorizontalCard } from "./item-horizontal-card";
import { items } from "@/modules/itens/items";

interface GridWithFiltersProps {
  itemsPerPage?: number;
}

export function GridWithFilters({ itemsPerPage = 20 }: GridWithFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filtrar dados baseado nos filtros aplicados
  const filteredData = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.effect.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter]);

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
    reset,
  } = usePagination({
    data: filteredData,
    itemsPerPage,
  });

  // Handlers para mudanças nos filtros
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  // Obter tipos únicos para o filtro
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(items.map(item => item.type))];
    return types.sort();
  }, []);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Buscar por nome ou efeito..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
        
        <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid de itens */}
      <div className="py-4 grid grid-cols lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentData.map(item => (
          <ItemHorizontalCard key={item.id} item={item} />
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum item encontrado com os filtros aplicados.
        </div>
      )}

      {/* Paginação */}
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