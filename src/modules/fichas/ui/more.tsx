import { useMemo, useState } from 'react';
import Abilities from './abilities';
import Combat from './combat';
import Inventory from './inventory';
import Notes from './notes';
import Spells from './spells';
import Tabs from './tabs';

function More() {
    const [selectedId, setSelectedId] = useState<string | null>('inventory');

    const tabs = useMemo(() => [
        {
            id: 'abilities',
            name: 'Habilidades',
        },
        {
            id: 'inventory',
            name: 'Inventário',
        },
        {
            id: 'spells',
            name: 'Feitiços',
        },
        {
            id: 'notes',
            name: 'Notas',
        },
    ], []);

    const mobileTabs = useMemo(() => [
        {
            id: 'combat',
            name: 'Combate',
        },
        ...tabs,
    ], [tabs]);

    function handleSelected(id: string) {
        setSelectedId(id);
    }

    return (
        <div id="More" className="card overflow-hidden h-full">
            <div className="block lg:hidden">
                <Tabs tabs={mobileTabs} selectedId={selectedId} handleSelected={handleSelected} />
            </div>
            <div className="hidden lg:block">
                <Tabs tabs={tabs} selectedId={selectedId} handleSelected={handleSelected} />
            </div>
            {selectedId === 'inventory' && <Inventory />}
            {selectedId === 'abilities' && <Abilities />}
            {selectedId === 'spells' && <Spells />}
            {selectedId === 'notes' && <Notes />}
            {selectedId === 'combat' && <Combat />}
        </div>
    );
}

export default More;