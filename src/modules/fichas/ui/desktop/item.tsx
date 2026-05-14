'use client'

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { handleInputChange } from '../../appChanges';
import { saveCharacter } from '../../stores/character';
import { useInventoryStore } from '../../stores/inventory';

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
}

function Item({ data, newItem }: ItemProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const inventory = useInventoryStore();
    const updateInventory = useInventoryStore((state) => state.updateInventory);

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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            draggable
        >
            <button
                type="button"
                className="w-12 cursor-pointer"
                onClick={() => deleteItem(data.id)}
            >
                {isHovered && <X size={12} />}
            </button>
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