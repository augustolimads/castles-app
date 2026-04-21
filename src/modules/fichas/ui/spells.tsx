import { useMemo } from 'react';
import { useSpellsStore } from '../stores/spell';
import SpellBlock from './spell-block';

function Spells() {
    const spells = useSpellsStore();
    const spellsLevel = useMemo(() => Object.keys(spells.level), [spells.level]);

    return (
        <div className="flex flex-col gap-2 overflow-y-scroll max-h-170 pb-4">
            {spellsLevel.map((spellLevel) => (
                <SpellBlock key={spellLevel} spellLevel={spellLevel} />
            ))}
        </div>
    );
}

export default Spells;