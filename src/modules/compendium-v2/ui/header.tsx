"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Filter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenFilters: () => void;
  onCreate: () => void;
}

export function Header({
  search,
  onSearchChange,
  onOpenFilters,
  onCreate,
}: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearch, onSearchChange, search]);

  return (
    <header className="sticky top-2 left-0 right-0 bg-secondary py-2 px-2 border rounded-lg flex flex-col gap-2 z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          <SidebarTrigger variant="outline" size="lg" className="p-4" />

          <div className="relative w-full lg:max-w-md">
            <Search
              className="absolute top-2.5 left-2 pointer-events-none text-muted-foreground"
              size={18}
            />
            <Input
              name="search"
              className="w-full pl-8 bg-white"
              placeholder="Buscar por nome"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onOpenFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo
          </Button>
        </div>
      </div>
    </header>
  );
}
