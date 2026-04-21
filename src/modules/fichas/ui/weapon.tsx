'use client';

import { DicesIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { handleInputChange } from '../appChanges';
import { saveCharacter } from '../stores/character';
import { useInventoryStore, useWeaponsStore } from '../stores/inventory';
import { setRollDice } from '../stores/rollDice';
import { useDiscordStore } from '../stores/sheet';

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
}

function Weapon({ newWeapon, deleteWeapon, data }: WeaponProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
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

    function handleClick() {
        setRollDice(`1d20+${data.dmg}`);
        useDiscordStore.getState().setTitle(data.name);
        useDiscordStore.getState().setIsWeaponRoll(true);
        useDiscordStore.getState().setWeaponAttackMod(data.bth);
    }

    return (
        <div
            id={data.id}
            role="button"
            tabIndex={0}
            className="flex gap-2"
            onMouseEnter={() => setIsHovered(true)}
            onFocus={() => void 0}
            onMouseLeave={() => setIsHovered(false)}
            onBlur={() => void 0}
            draggable
        >
            {weapons.isDeleteMode ? (
                <button
                    type="button"
                    className="w-8 cursor-pointer"
                    onClick={() => deleteWeapon(data.id)}
                >
                    {isHovered && <X size={12} />}
                </button>
            ) : (
                <button type="button" className="w-8 cursor-pointer" onClick={handleClick}>
                    <DicesIcon size={14} />
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