'use client'

import { charClasses } from '@/modules/compendium/charClasses';
import { races } from '@/modules/compendium/races';
import { Plus, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import { handleInputChange } from '../../appChanges';
import { saveCharacter, useCharacterStore } from '../../stores/character';

type AbilityField = 'title' | 'description' | 'origin';

function Abilities() {
    const character = useCharacterStore();
    const updateCharacter = useCharacterStore((state) => state.updateCharacter);
    const [isDeleteMode, setIsDeleteMode] = useState(false);

    const raceInfo = useMemo(() => {
        const raceName = character.info.race?.toLowerCase().trim() || '';
        return races.find(race =>
            race.id === raceName ||
            race.name.toLowerCase() === raceName
        );
    }, [character.info.race]);

    const classInfo = useMemo(() => {
        const className = character.info.charClass?.toLowerCase().trim() || '';
        return charClasses.find(cls =>
            cls.id === className ||
            cls.name.toLowerCase() === className
        );
    }, [character.info.charClass]);

    const classLevel = useMemo(() => {
        const level = character.info.level || 1;
        return classInfo?.levels.find((l) => l.level === level);
    }, [classInfo, character.info.level]);

    const defaultAbilities = useMemo(() => {
        const fromRace = (raceInfo?.traits || []).map((trait) => ({
            id: v4(),
            title: trait.title,
            description: trait.description || '',
            origin: 'raça',
        }));

        const fromClass = (classLevel?.abilities || []).map((ability) => ({
            id: v4(),
            title: ability.name,
            description: ability.description || '',
            origin: 'classe',
        }));

        return [...fromRace, ...fromClass];
    }, [raceInfo, classLevel]);

    useEffect(() => {
        if (character.abilities.length > 0) {
            return;
        }

        if (defaultAbilities.length === 0) {
            return;
        }

        handleInputChange();
        updateCharacter({ abilities: defaultAbilities });
        saveCharacter();
    }, [character.abilities.length, defaultAbilities, updateCharacter]);

    function addAbility() {
        const nextAbilities = [
            ...character.abilities,
            {
                id: v4(),
                title: '',
                description: '',
                origin: '',
            },
        ];

        handleInputChange();
        updateCharacter({ abilities: nextAbilities });
        saveCharacter();
    }

    function deleteAbility(id: string) {
        const nextAbilities = character.abilities.filter((ability) => ability.id !== id);
        handleInputChange();
        updateCharacter({ abilities: nextAbilities });
        saveCharacter();
    }

    function updateAbility(id: string, field: AbilityField, value: string) {
        const nextAbilities = character.abilities.map((ability) => (
            ability.id === id ? { ...ability, [field]: value } : ability
        ));

        handleInputChange();
        updateCharacter({ abilities: nextAbilities });
        saveCharacter();
    }

    return (
        <div className="flex flex-col gap-2 md:h-[65vh] md:overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-2xl text-left">Habilidades</h2>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="btn-xs cursor-pointer flex items-center justify-center"
                        onClick={() => setIsDeleteMode((prev) => !prev)}
                        title={isDeleteMode ? 'Voltar' : 'Deletar'}
                    >
                        {isDeleteMode ? 'voltar' : 'deletar'}
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer flex items-center justify-center"
                        onClick={addAbility}
                        title="Adicionar habilidade"
                        aria-label="Adicionar habilidade"
                    >
                        <Plus />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2 pb-6">
                {character.abilities.map((ability) => (
                    <article key={ability.id} className="rounded-md border bg-card p-2 flex gap-2">
                        {isDeleteMode ? (
                            <button
                                type="button"
                                className="w-8 cursor-pointer text-muted-foreground hover:text-destructive"
                                onClick={() => deleteAbility(ability.id)}
                                aria-label="Excluir habilidade"
                            >
                                <X size={14} />
                            </button>
                        ) : (
                            <div className="w-8 flex items-start justify-center pt-2 text-muted-foreground/70">
                                <Trash2 size={14} />
                            </div>
                        )}

                        <div className="flex-1 grid gap-2">
                            <input
                                className="input w-full"
                                placeholder="Title"
                                value={ability.title}
                                onFocus={(e) => e.currentTarget.select()}
                                onInput={(e) => updateAbility(ability.id, 'title', e.currentTarget.value)}
                            />
                            <textarea
                                className="input min-h-20 w-full py-2"
                                placeholder="Description"
                                value={ability.description}
                                onFocus={(e) => e.currentTarget.select()}
                                onInput={(e) => updateAbility(ability.id, 'description', e.currentTarget.value)}
                            />
                            <input
                                className="input w-full"
                                placeholder="Origin"
                                value={ability.origin}
                                onFocus={(e) => e.currentTarget.select()}
                                onInput={(e) => updateAbility(ability.id, 'origin', e.currentTarget.value)}
                            />
                        </div>
                    </article>
                ))}

                {character.abilities.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma habilidade cadastrada.</p>
                )}
            </div>
        </div>
    );
}

export default Abilities;