'use client';

import { GripVertical, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { handleInputChange } from '../../appChanges';
import { saveCharacter } from '../../stores/character';
import { useEquipmentsStore, useInventoryStore } from '../../stores/inventory';

interface EquipmentData {
    id: string;
    name: string;
    ac: number;
    ev: number;
}

interface EquipmentProps {
    newEquipment: () => void;
    deleteEquipment: (id: string) => void;
    data: EquipmentData;
    onDragStart: (id: string) => void;
    onDrop: (id: string) => void;
    onDragEnd: () => void;
}

function Equipment({ newEquipment, deleteEquipment, data, onDragStart, onDrop, onDragEnd }: EquipmentProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const equipments = useEquipmentsStore();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handlePress(event: React.KeyboardEvent) {
        if (event.code === 'Enter') {
            newEquipment();
        }
        if ((event.target as HTMLInputElement).value === '' && event.code === 'Backspace') {
            deleteEquipment(data.id);
        }
        saveCharacter();
    }

    function updateEquipment(id: string, keyInput: string, value: string | number) {
        handleInputChange();
        const inventory = useInventoryStore.getState();
        useInventoryStore.getState().updateInventory({
            equipments: inventory.equipments.map((equipment) =>
                equipment.id === id ? { ...equipment, [keyInput]: value } : equipment
            ),
        });
        saveCharacter();
    }

    return (
        <div
            id={data.id}
            className="flex gap-2"
        >
            {equipments.isDeleteMode && (
                <button
                    type="button"
                    className="w-12 cursor-pointer"
                    onClick={() => deleteEquipment(data.id)}
                >
                    <X size={12} />
                </button>
            )}
            {!equipments.isDeleteMode && (
                <button
                    type="button"
                    aria-label="Mover equipamento"
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
                id="name"
                className="input w-full"
                onKeyDown={handlePress}
                placeholder="Nome"
                ref={inputRef}
                value={data.name}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    const target = e.currentTarget;
                    updateEquipment(data.id, 'name', target.value);
                }}
            />
            <input
                id="ac"
                type="number"
                className="input w-10"
                onKeyDown={handlePress}
                placeholder="CA"
                value={data.ac}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    const target = e.currentTarget;
                    updateEquipment(data.id, 'ac', target.value);
                }}
            />
            <input
                id="ev"
                type="number"
                className="input w-10"
                onKeyDown={handlePress}
                placeholder="EV"
                value={data.ev}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    const target = e.currentTarget;
                    updateEquipment(data.id, 'ev', target.value);
                }}
            />
        </div>
    );
}

export default Equipment;
