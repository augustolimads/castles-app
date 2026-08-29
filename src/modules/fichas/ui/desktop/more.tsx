import { useMemo, useState } from 'react';
import Abilities from '../shared/abilities';
import Notes from '../shared/notes';
import Spells from '../shared/spells';
import Combat from './combat';
import Inventory from './inventory';
import Tabs from './tabs';

function More() {
    const [selectedId, setSelectedId] = useState<string | null>('inventory');

    const tabs = useMemo(() => [
        {
            id: 'combat',
            name: 'Combate',
        },
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

    function handleSelected(id: string) {
        setSelectedId(id);
    }

    return (
        <div id="More" className="card overflow-hidden h-full">
            <Tabs tabs={tabs} selectedId={selectedId} handleSelected={handleSelected} />
            {selectedId === 'inventory' && <Inventory />}
            {selectedId === 'abilities' && <Abilities />}
            {selectedId === 'spells' && <Spells />}
            {selectedId === 'notes' && <Notes />}
            {selectedId === 'combat' && <Combat />}
        </div>
    );
}

export default More;