'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Item } from '@/modules/itens/use-items';
import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ItemSearchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectItem: (item: Item) => void;
    items: Item[];
    typeFilter?: string[];
    title?: string;
}

export function ItemSearchModal({
    open,
    onOpenChange,
    onSelectItem,
    items,
    typeFilter,
    title = 'Buscar e Adicionar Itens',
}: ItemSearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return [];

        const term = searchTerm.toLowerCase();
        let filtered = items.filter(
            (item) =>
                item.name.toLowerCase().includes(term) ||
                item.type.toLowerCase().includes(term) ||
                item.effect.toLowerCase().includes(term)
        );

        // Aplicar filtro de tipo se fornecido
        if (typeFilter && typeFilter.length > 0) {
            filtered = filtered.filter((item) => typeFilter.includes(item.type));
        }

        return filtered.slice(0, 20);
    }, [items, searchTerm, typeFilter]);

    const handleSelectItem = (item: Item) => {
        onSelectItem(item);
        setSearchTerm('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar itens por nome, tipo ou efeito..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            autoFocus
                        />
                    </div>

                    {searchTerm && filteredItems.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Nenhum item encontrado com "{searchTerm}"
                        </p>
                    )}

                    {filteredItems.length > 0 && (
                        <div className="max-h-96 overflow-auto border rounded-lg">
                            {filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0 flex items-center justify-between"
                                >
                                    <button
                                        type="button"
                                        className="flex-1 text-left"
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {item.type} • {item.gold} PO
                                            {item.ev !== null && ` • ${item.ev} EV`}
                                        </div>
                                        {item.effect && (
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {item.effect}
                                            </div>
                                        )}
                                    </button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
