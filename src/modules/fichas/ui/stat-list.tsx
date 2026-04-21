'use client';

import { handleInputChange } from '../appChanges';
import { saveCharacter, useCharacterStore } from '../stores/character';
import Ac from './Ac';
import Hp from './Hp';
import Stat from './stat';

function StatList() {
    const character = useCharacterStore();

    type TStatKey = keyof typeof character.stats;

    function updateStat(id: string, newValue: string) {
        handleInputChange();
        const statId = id as TStatKey;
        useCharacterStore.getState().updateCharacter({
            stats: {
                ...character.stats,
                [statId]: newValue,
            },
        });
        saveCharacter();
    }

    return (
        <div id="StatList" className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <Ac />
                <Hp />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Stat
                    id="init"
                    name="Iniciativa"
                    value={character.stats.init}
                    updateStat={updateStat}
                />
                <Stat
                    id="speed"
                    name="Velocidade"
                    value={character.stats.speed}
                    updateStat={updateStat}
                />
                <Stat
                    id="bth"
                    name="BBA"
                    value={character.stats.bth}
                    updateStat={updateStat}
                />
            </div>
        </div>
    );
}

export default StatList;