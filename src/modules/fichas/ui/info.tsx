'use client';

import { charClasses } from '@/modules/compendium/charClasses';
import { useEffect, useMemo } from 'react';
import { handleInputChange } from '../appChanges';
import { saveCharacter, useCharacterStore } from '../stores/character';
import TextInput from './text-input';

function Info() {
    const character = useCharacterStore();
    
    type TInfoKey = keyof typeof character.info;

    // Calcular XP necessária para o próximo nível baseado na classe
    // biome-ignore lint/correctness/useExhaustiveDependencies: Monitorar apenas level e charClass
    useEffect(() => {
        const { charClass, level, nextLevel } = character.info;

        if (!charClass || !level) return;

        const characterClass = charClasses.find(
            (c) => c.name.toLowerCase() === charClass.toLowerCase()
        );

        if (!characterClass) return;

        const nextLevelData = characterClass.levels.find(
            (l) => l.level === level + 1
        );

        if (nextLevelData && nextLevelData.experience !== nextLevel) {
            useCharacterStore.getState().updateCharacter({
                info: {
                    ...character.info,
                    nextLevel: nextLevelData.experience,
                },
            });
        }
    }, [character.info.level, character.info.charClass]);

    function updateInput(id: string, newValue: string | number) {
        handleInputChange();
        const infoId = id as TInfoKey;
        
        if (
            infoId === 'charClass' ||
            infoId === 'race' ||
            infoId === 'disposition' ||
            (infoId === 'languages' && typeof newValue === 'string')
        ) {
            useCharacterStore.getState().updateCharacter({
                info: {
                    ...character.info,
                    [infoId]: newValue,
                },
            });
        } else if (
            infoId === 'level' ||
            infoId === 'xp' ||
            (infoId === 'nextLevel' && typeof newValue === 'number')
        ) {
            useCharacterStore.getState().updateCharacter({
                info: {
                    ...character.info,
                    [infoId]: newValue,
                },
            });
        }
        saveCharacter();
    }

    const raceSuggestions = useMemo(() => [
        'Anão',
        'Elfo',
        'Gnomo',
        'Halfling',
        'Humano',
        'Meio-Elfo',
        'Meio-Orc',
    ], []);

    const classSuggestions = useMemo(() => [
        'Assassino',
        'Bárbaro',
        'Bardo',
        'Clérigo',
        'Druida',
        'Combatente',
        'Ilusionista',
        'Cavaleiro',
        'Monge',
        'Paladino',
        'Explorador',
        'Trapaceiro',
        'Mago',
    ], []);

    const dispositionSuggestions = useMemo(() => [
        'Leal e Bom',
        'Leal e Neutro',
        'Leal e Mau',
        'Neutro e Bom',
        'Neutro e Mau',
        'Neutro e Leal',
        'Neutro e Caótico',
        'Neutro',
        'Caótico e Bom',
        'Caótico e Neutro',
        'Caótico e Mau',
        'Bom e Leal',
        'Bom e Neutro',
        'Bom e Caótico',
        'Mau e Leal',
        'Mau e Neutro',
        'Mau e Caótico',
    ], []);

    return (
        <div id="Info" className="grid grid-cols-3 gap-x-2">
            <TextInput
                id="race"
                name="Raça"
                list={raceSuggestions}
                value={character.info.race}
                updateInput={updateInput}
            />
            <TextInput
                id="charClass"
                name="Classe"
                list={classSuggestions}
                value={character.info.charClass}
                updateInput={updateInput}
            />
            <TextInput
                id="disposition"
                name="Tendência"
                list={dispositionSuggestions}
                value={character.info.disposition}
                updateInput={updateInput}
            />
            <TextInput
                id="level"
                name="Nível"
                isNumber
                value={character.info.level}
                updateInput={updateInput}
            />
            <TextInput
                id="xp"
                name="XP"
                isNumber
                value={character.info.xp}
                updateInput={updateInput}
            />
            <TextInput
                id="nextLevel"
                name="Próximo Nível"
                isNumber
                disabled
                value={character.info.nextLevel}
                updateInput={updateInput}
            />
        </div>
    );
}

export default Info;