'use client';

import { useEffect } from 'react';
import { handleInputChange } from '../appChanges';
import { type TAttr, updateAttr, updateEncumbraceRating } from '../attributeLogic';
import { saveCharacter, useCharacterStore } from '../stores/character';
import Attribute from './attribute';

function AttributeList() {
    const character = useCharacterStore();

    function togglePrimary(id: string, newValue: boolean) {
        const attrId = id as TAttr;
        if (
            attrId === 'str' ||
            attrId === 'dex' ||
            attrId === 'con' ||
            attrId === 'int' ||
            attrId === 'wis' ||
            attrId === 'cha'
        ) {
            handleInputChange();
            useCharacterStore.getState().updateCharacter({
                attr: {
                    ...character.attr,
                    [attrId]: {
                        ...character.attr[attrId],
                        isPrimary: Boolean(newValue),
                    },
                },
            });
            updateEncumbraceRating();
            saveCharacter();
        }
    }

    useEffect(() => {
        updateEncumbraceRating();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-y-5 gap-x-2 md:flex md:flex-col md:gap-10 md:justify-between">
            <Attribute
                id="str"
                name="FOR"
                desc="Força - Determina capacidade de ataque corpo a corpo e carga"
                score={character.attr.str}
                updateAttr={updateAttr}
                togglePrimary={togglePrimary}
            />
            <Attribute
                id="dex"
                name="DES"
                desc="Destreza - Determina iniciativa, CA e ataques à distância"
                score={character.attr.dex}
                updateAttr={updateAttr}
                togglePrimary={togglePrimary}
            />
            <Attribute
                id="con"
                name="CON"
                desc="Constituição - Determina pontos de vida"
                score={character.attr.con}
                updateAttr={updateAttr}
                togglePrimary={togglePrimary}
            />
            <Attribute
                id="int"
                name="INT"
                desc="Inteligência - Determina conhecimento e raciocínio"
                score={character.attr.int}
                updateAttr={updateAttr}
                togglePrimary={togglePrimary}
            />
            <Attribute
                id="wis"
                name="SAB"
                desc="Sabedoria - Determina percepção e vontade"
                score={character.attr.wis}
                updateAttr={updateAttr}
                togglePrimary={togglePrimary}
            />
            <Attribute
                id="cha"
                name="CAR"
                desc="Carisma - Determina liderança e presença"
                score={character.attr.cha}
                updateAttr={updateAttr}
                togglePrimary={togglePrimary}
            />
        </div>
    );
}

export default AttributeList;