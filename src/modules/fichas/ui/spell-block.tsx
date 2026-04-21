import { useMemo } from 'react';
import { v4 } from 'uuid';
import { handleInputChange } from '../appChanges';
import { saveCharacter } from '../stores/character';
import { useSpellsStore } from '../stores/spell';
import Spell from './spell';
import SpellTitle from './spell-title';

interface SpellBlockProps {
    spellLevel: string;
}

function SpellBlock({ spellLevel }: SpellBlockProps) {
    const spells = useSpellsStore();
    const updateSpells = useSpellsStore((state) => state.updateSpells);

    const lv = useMemo(() => Number.parseInt(spellLevel.split('lv').join('')), [spellLevel]);

    const spellsByLv = useMemo(
        () => spells.known.filter((spell) => spell.level === lv),
        [spells.known, lv]
    );

    function newSpell() {
        handleInputChange();
        const newSpellData = {
            id: v4(),
            name: '',
            level: lv,
            slots: 0,
            description: '',
        };
        updateSpells({
            ...spells,
            known: [...spells.known, newSpellData],
        });
        saveCharacter();
    }

    function deleteSpell(id: string) {
        handleInputChange();
        const newSpells = spells.known.filter((spell) => spell.id !== id);
        updateSpells({
            ...spells,
            known: newSpells,
        });
        saveCharacter();
    }

    return (
        <div>
            <SpellTitle
                name={`Nível ${lv}`}
                lv={lv}
                primary={{
                    title: 'Novo Feitiço',
                    action: newSpell,
                }}
            />
            <div className="flex flex-col gap-2 pt-1">
                <div className="flex gap-7 text-left pl-10 text-xs">
                    <span>Espaço</span>
                    <span className="flex-1">Nome</span>
                </div>
                <div>
                    {spellsByLv.map((data) => (
                        <Spell key={data.id} newSpell={newSpell} deleteSpell={deleteSpell} data={data} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SpellBlock;