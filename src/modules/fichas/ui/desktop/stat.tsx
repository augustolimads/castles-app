'use client';

import { handleInputChange } from '../../appChanges';
import { saveCharacter } from '../../stores/character';

interface StatProps {
    id: string;
    name: string;
    value: string | number;
    updateStat: (id: string, newValue: string) => void;
}

function Stat({ id, name, value, updateStat }: StatProps) {
    function handleClick() {
        // TODO: Implementar setRollDice quando o sistema de dados estiver pronto
        // setRollDice('1d20' + value);
        // setDiscordTitle(name);
        console.log('Roll dice:', '1d20' + value, 'for', name);
    }

    return (
        <div id={id} className="card flex flex-col mb-1 relative px-2! pb-3!">
            <input
                id={id + 'Value'}
                className="input flex flex-1 text-center py-2"
                value={value ?? ''}
                type={id === 'speed' ? 'text' : 'number'}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    handleInputChange();
                    updateStat(id, e.currentTarget.value);
                    saveCharacter();
                }}
            />
            {id === 'speed' ? (
                <label htmlFor={id + 'Value'} className="badge px-2 text-xs">
                    {name}
                </label>
            ) : (
                <button
                    type="button"
                    onClick={handleClick}
                    className="badge px-2 text-xs cursor-pointer"
                >
                    {name}
                </button>
            )}
        </div>
    );
}

export default Stat;