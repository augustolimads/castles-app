'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CartButton } from "@/modules/itens/ui/cart-button";
import { CartDrawer } from "@/modules/itens/ui/cart-drawer";
import { Search, ShoppingBasket } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const categories = [
    { id: 'alojamento', label: 'Alojamentos' },
    { id: 'arma', label: 'Armas' },
    { id: 'armadura', label: 'Armaduras' },
    { id: 'distancia', label: 'Armas de projétil' },
    { id: 'elmo', label: 'Elmos' },
    { id: 'equipamento', label: 'Equipamentos' },
    { id: 'escudo', label: 'Escudos' },
    { id: 'estabulo', label: 'Estábulos' },
    { id: 'municao', label: 'Munição' },
    { id: 'provisoes', label: 'Provisões' },
    { id: 'roupas', label: 'Roupas' },
    { id: 'transporte', label: 'Transporte' },
];

const sortOptions = [
    { id: 'name_asc', label: 'Nome (A-Z)' },
    { id: 'name_desc', label: 'Nome (Z-A)' },
    { id: 'gold_asc', label: 'Valor (Menor)' },
    { id: 'gold_desc', label: 'Valor (Maior)' },
    { id: 'ev_asc', label: 'EV (Menor)' },
    { id: 'ev_desc', label: 'EV (Maior)' },
];

export function Header() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || '';

    // Estado local para o input de busca (para debounce)
    const [searchInputValue, setSearchInputValue] = useState(currentSearch);

    // Sincronizar o input local com os searchParams quando eles mudam externamente
    useEffect(() => {
        setSearchInputValue(currentSearch);
    }, [currentSearch]);

    // Debounce da busca
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchInputValue !== currentSearch) {
                updateSearchParams({ search: searchInputValue });
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchInputValue]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateSearchParams = useCallback((updates: { category?: string; search?: string; sort?: string }) => {
        const params = new URLSearchParams(searchParams.toString());

        // Atualizar category
        if (updates.category !== undefined) {
            if (updates.category === '' || updates.category === 'all') {
                params.delete('category');
            } else {
                params.set('category', updates.category);
            }
        }

        // Atualizar search
        if (updates.search !== undefined) {
            if (updates.search === '') {
                params.delete('search');
            } else {
                params.set('search', updates.search);
            }
        }

        // Atualizar sort
        if (updates.sort !== undefined) {
            if (updates.sort === '') {
                params.delete('sort');
            } else {
                params.set('sort', updates.sort);
            }
        }

        // Reset page quando filtros mudam
        params.delete('page');

        const query = params.toString();
        const url = query ? `${pathname}?${query}` : pathname;
        router.push(url, { scroll: false });
    }, [searchParams, pathname, router]);

    const handleCategorySelect = useCallback((categoryId: string) => {
        updateSearchParams({ category: categoryId });
    }, [updateSearchParams]);

    const handleSearchChange = useCallback((search: string) => {
        setSearchInputValue(search);
    }, []);

    const handleSortSelect = useCallback((sortId: string) => {
        updateSearchParams({ sort: sortId });
    }, [updateSearchParams]);

    const handleClearAllFilters = useCallback(() => {
        setSearchInputValue('');
        updateSearchParams({ category: 'all', search: '', sort: '' });
    }, [updateSearchParams]);

    return (
        <header className="sticky top-2 left-0 right-0 bg-secondary py-2 px-2 border rounded-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex gap-8 flex-1 items-center">
                    <SidebarTrigger variant='outline' size='lg' className="p-4" />
                    <div className="relative w-72 hidden lg:block">
                        <Search className="absolute top-2 left-2 pointer-events-none" size={20} color="gray" />
                        <Input
                            name="search"
                            className="w-full pl-8 bg-white"
                            placeholder="Pesquise um item"
                            value={searchInputValue}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <span>Filtros:</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer font-semibold">
                                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3">
                                    {currentCategory ?
                                        categories.find(cat => cat.id === currentCategory)?.label || 'Categorias' :
                                        'Categorias'
                                    }
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleCategorySelect('all')}>
                                    Todas as categorias
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {categories.map(category => (
                                    <DropdownMenuItem
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category.id)}
                                    >
                                        {category.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer font-semibold">
                                <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3">
                                    {currentSort ?
                                        sortOptions.find(sort => sort.id === currentSort)?.label || 'Ordenação' :
                                        'Ordenação'
                                    }
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleSortSelect('')}>
                                    Padrão
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {sortOptions.map(sortOption => (
                                    <DropdownMenuItem
                                        key={sortOption.id}
                                        onClick={() => handleSortSelect(sortOption.id)}
                                    >
                                        {sortOption.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="link"
                            size="sm"
                            onClick={handleClearAllFilters}
                            className="h-9 px-3 cursor-pointer"
                            title="Limpar todos os filtros"
                        >
                            <span className="hidden sm:inline-block ml-1">Limpar</span>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-4 xl:hidden">
                    <CartDrawer>
                        <Button variant="outline" title="carrinho de compras" className="cursor-pointer">
                            <ShoppingBasket />
                        </Button>
                    </CartDrawer>
                    <CartButton />
                </div>
            </div>
            <div className="relative w-full block lg:hidden">
                <Search className="absolute top-2 left-2 pointer-events-none" size={20} color="gray" />
                <Input
                    name="search"
                    className="w-full pl-8 bg-white"
                    placeholder="Pesquise um item"
                    value={searchInputValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>
        </header>
    )
}
