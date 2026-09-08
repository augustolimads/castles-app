'use client'

import { GripVertical, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { handleInputChange } from '../../appChanges';
import { saveCharacter } from '../../stores/character';
import { useInventoryStore, useItemsStore } from '../../stores/inventory';

interface ItemData {
    id: string;
    name: string;
    qtd: number;
    description: string;
    ev: number;
}

interface ItemProps {
    data: ItemData;
    newItem: () => void;
    onDragStart: (id: string) => void;
    onDrop: (id: string) => void;
    onDragEnd: () => void;
}

function Item({ data, newItem, onDragStart, onDrop, onDragEnd }: ItemProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const inventory = useInventoryStore();
    const updateInventory = useInventoryStore((state) => state.updateInventory);
    const itemsStore = useItemsStore();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function deleteItem(id: string) {
        handleInputChange();
        const newItems = inventory.items.filter((item) => item.id !== id);
        updateInventory({
            ...inventory,
            items: newItems,
        });
        saveCharacter();
    }

    function handlePress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === 'Enter') {
            newItem();
        }
        if (
            data.name === '' &&
            event.currentTarget.value === '' &&
            event.code === 'Backspace'
        ) {
            deleteItem(data.id);
        }
        saveCharacter();
    }

    function updateItem(
        id: string,
        inputKey: 'name' | 'description' | 'ev' | 'qtd',
        value: string | number
    ) {
        handleInputChange();
        const numberValue = Number(value);
        const resultValue = (inputKey === 'qtd' || inputKey === 'ev') ? numberValue : value;
        updateInventory({
            ...inventory,
            items: inventory.items.map((item) =>
                item.id === id ? { ...item, [inputKey]: resultValue } : item
            ),
        });
        saveCharacter();
    }

    return (
        <div
            id={data.id}
            className="flex gap-2"
        >
            {itemsStore.isDeleteMode ? (
                <button
                    type="button"
                    className="w-12 cursor-pointer"
                    onClick={() => deleteItem(data.id)}
                >
                    <X size={12} />
                </button>
            ) : (
                <button
                    type="button"
                    aria-label="Mover item"
                    draggable
                    onDragStart={() => onDragStart(data.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                        event.preventDefault();
                        onDrop(data.id);
                    }}
                    onDragEnd={onDragEnd}
                    className="w-12 flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground/70"
                >
                    <GripVertical size={14} />
                </button>
            )}
            <input
                id="qtd"
                className="input w-8"
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={handlePress}
                placeholder="Qtd"
                value={data.qtd}
                type="number"
                min="1"
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    updateItem(data.id, 'qtd', target.value);
                }}
            />
            <input
                id="name"
                className="input w-full"
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={handlePress}
                placeholder="Nome"
                value={data.name}
                ref={inputRef}
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    updateItem(data.id, 'name', target.value);
                }}
            />
            <input
                id="ev"
                className="input w-10"
                type="number"
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={handlePress}
                placeholder="EV"
                value={data.ev}
                onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    updateItem(data.id, 'ev', target.value);
                }}
            />
        </div>
    );
}

export default Item;