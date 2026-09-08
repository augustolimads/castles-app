'use client';

import { GripVertical, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { handleInputChange } from '../../appChanges';
import { saveCharacter } from '../../stores/character';
import { useInventoryStore, useWeaponsStore } from '../../stores/inventory';

interface WeaponData {
    id: string;
    name: string;
    bth: string;
    dmg: string;
    ev: number;
}

interface WeaponProps {
    newWeapon: () => void;
    deleteWeapon: (id: string) => void;
    data: WeaponData;
    onDragStart: (id: string) => void;
    onDrop: (id: string) => void;
    onDragEnd: () => void;
}

function Weapon({ newWeapon, deleteWeapon, data, onDragStart, onDrop, onDragEnd }: WeaponProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const weapons = useWeaponsStore();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handlePress(event: React.KeyboardEvent) {
        if (event.code === 'Enter') {
            newWeapon();
        }
        if ((event.target as HTMLInputElement).value === '' && event.code === 'Backspace') {
            deleteWeapon(data.id);
        }
        saveCharacter();
    }

    function updateWeapon(id: string, keyInput: string, value: string | number) {
        handleInputChange();
        const inventory = useInventoryStore.getState();
        useInventoryStore.getState().updateInventory({
            weapons: inventory.weapons.map((weapon) =>
                weapon.id === id ? { ...weapon, [keyInput]: value } : weapon
            ),
        });
        saveCharacter();
    }

    return (
        <div
            id={data.id}
            className="flex gap-2"
        >
            {weapons.isDeleteMode ? (
                <button
                    type="button"
                    className="w-8 cursor-pointer"
                    onClick={() => deleteWeapon(data.id)}
                >
                    <X size={12} />
                </button>
            ) : (
                    <button
                        type="button"
                        aria-label="Mover arma"
                        draggable
                        onDragStart={() => onDragStart(data.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            onDrop(data.id);
                        }}
                        onDragEnd={onDragEnd}
                        className="w-8 flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground/70"
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
                    updateWeapon(data.id, 'name', target.value);
                }}
            />
            <input
                id="bth"
                type="number"
                className="input w-5 text-sm"
                onKeyDown={handlePress}
                placeholder="BA"
                value={data.bth}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    const target = e.currentTarget;
                    updateWeapon(data.id, 'bth', target.value);
                }}
            />
            <input
                id="dmg"
                className="input w-14 text-sm"
                onKeyDown={handlePress}
                placeholder="Dano"
                value={data.dmg}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    const target = e.currentTarget;
                    updateWeapon(data.id, 'dmg', target.value);
                }}
            />
            <input
                id="ev"
                type="number"
                className="input w-5 text-sm"
                onKeyDown={handlePress}
                placeholder="EV"
                value={data.ev}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    const target = e.currentTarget;
                    updateWeapon(data.id, 'ev', target.value);
                }}
            />
        </div>
    );
}

export default Weapon;