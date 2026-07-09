'use client'

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { handleInputChange } from '../../appChanges';
import { saveCharacter } from '../../stores/character';
import { useSpellsStore } from '../../stores/spell';

interface SpellData {
    id: string;
    name: string;
    level: number;
    slots: number;
    description: string;
}

interface SpellProps {
    newSpell: () => void;
    deleteSpell: (id: string) => void;
    data: SpellData;
}

function Spell({ newSpell, deleteSpell, data }: SpellProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const spells = useSpellsStore();
    const updateSpells = useSpellsStore((state) => state.updateSpells);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handlePress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.code === 'Enter') {
            newSpell();
        }
        if (
            data.name === '' &&
            event.currentTarget.value === '' &&
            event.code === 'Backspace'
        ) {
            deleteSpell(data.id);
        }
        saveCharacter();
    }

    function updateSpell(
        id: string,
        inputKey: 'name' | 'description' | 'slots' | 'level',
        value: string | number
    ) {
        handleInputChange();
        updateSpells({
            ...spells,
            known: spells.known.map((spell) => {
                if (spell.id === id) {
                    return {
                        ...spell,
                        [inputKey]: value,
                    };
                }
                return spell;
            }),
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
                onClick={() => deleteSpell(data.id)}
            >
                {isHovered && <X size={12} />}
            </button>
            <input
                id="slots"
                className="input w-8"
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={handlePress}
                placeholder="Espaço"
                type="number"
                value={data.slots}
                onInput={(event) => {
                    const target = event.target as HTMLInputElement;
                    updateSpell(data.id, 'slots', target.value);
                    saveCharacter();
                }}
            />
            <input
                id="name"
                className="input w-full"
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={handlePress}
                placeholder="Nome"
                ref={inputRef}
                value={data.name}
                onInput={(event) => {
                    const target = event.target as HTMLInputElement;
                    updateSpell(data.id, 'name', target.value);
                    saveCharacter();
                }}
            />
        </div>
    );
}

export default Spell;