import { useCharacterStore } from './stores/character';

export function setAttributeMod(value: number) {
    const scoreValue = Number(value);
    if (scoreValue === 1) {
        return '-4';
    }
    if (scoreValue >= 2 && scoreValue <= 3) {
        return '-3';
    }
    if (scoreValue >= 4 && scoreValue <= 5) {
        return '-2'
    }
    if (scoreValue >= 6 && scoreValue <= 8) {
        return '-1';
    }
    if (scoreValue >= 9 && scoreValue <= 12) {
        return '+0';
    }
    if (scoreValue >= 13 && scoreValue <= 15) {
        return '+1';
    }
    if (scoreValue >= 16 && scoreValue <= 17) {
        return '+2';
    }
    if (scoreValue >= 18) {
        return '+3';
    }
    return '0';
}

export type TAttr = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'

export function updateAttr(id: TAttr, newValue: string) {
    if (
        id === 'str' ||
        id === 'dex' ||
        id === 'con' ||
        id === 'int' ||
        id === 'wis' ||
        id === 'cha'
    ) {
        const character = useCharacterStore.getState();
        useCharacterStore.getState().updateCharacter({
            attr: {
                ...character.attr,
                [id]: {
                    ...character.attr[id],
                    value: Number.parseInt(newValue),
                },
            },
        });

        updateEncumbraceRating();
    }
}

export function updateEncumbraceRating() {
    const character = useCharacterStore.getState();
    const strPrimarySum3 = character.attr.str.type === 1 ? 3 : 0;
    const conPrimarySum3 = character.attr.con.type === 1 ? 3 : 0;
    const capacity = character.stats.capacity || 0;
    const newRating = character.attr.str.value + strPrimarySum3 + conPrimarySum3 + Number(capacity);
    
    useCharacterStore.getState().updateCharacter({
        encumbrance: {
            ...character.encumbrance,
            rating: newRating,
            enc3x: newRating * 3,
        },
    });
}