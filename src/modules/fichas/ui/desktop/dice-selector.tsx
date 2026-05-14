import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRollDiceStore } from '../../stores/rollDice';
import { setDiscordTitle } from '../../stores/sheet';
import TextInput from './text-input';

type TDiceKey = 'd3' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

const initialDiceSelected = {
    d3: 0,
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 0,
    d100: 0,
};

function DiceSelector() {
    const [rollResult, setRollResult] = useState<string | number>('');
    const [rollBonus, setRollBonus] = useState(0);
    const [diceSelected, setDiceSelected] = useState(initialDiceSelected);
    const setRollDice = useRollDiceStore((state) => state.setFormula);

    function updateRollResult(newDice = diceSelected, newBonus = rollBonus) {
        const newResult = [];

        for (const key of Object.keys(newDice)) {
            if (newDice[key as TDiceKey] > 0) {
                newResult.push(`${newDice[key as TDiceKey]}${key}`);
            }
        }

        let result = newResult.join('+');

        if (newBonus > 0) {
            result = `${result}+${newBonus}`;
        } else if (newBonus < 0) {
            result = `${result}${newBonus}`;
        }

        setRollResult(result);
    }

    function incrementDice(id: TDiceKey) {
        const newDice = {
            ...diceSelected,
            [id]: diceSelected[id] + 1,
        };
        setDiceSelected(newDice);
        updateRollResult(newDice, rollBonus);
    }

    function decrementDice(event: React.MouseEvent, id: TDiceKey) {
        event.preventDefault();
        if (diceSelected[id] > 0) {
            const newDice = {
                ...diceSelected,
                [id]: diceSelected[id] - 1,
            };
            setDiceSelected(newDice);
            updateRollResult(newDice, rollBonus);
        }
    }

    function handleCounter(type: 'plus' | 'minus') {
        const newBonus = type === 'plus' ? rollBonus + 1 : rollBonus - 1;
        setRollBonus(newBonus);
        updateRollResult(diceSelected, newBonus);
    }

    function handleRoll() {
        if (rollResult) {
            setRollDice(String(rollResult));
            setRollResult('');
            setRollBonus(0);
            setDiscordTitle('');
            setDiceSelected(initialDiceSelected);
        }
    }

    return (
        <div>
            <div className="border border-stone-700 rounded-md mb-1 bg-stone-900">
                <TextInput
                    id="rollResult"
                    name=""
                    updateInput={() => {}}
                    value={rollResult}
                    disabled
                />
            </div>
            <div className="grid grid-cols-4">
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d3')}
                    onContextMenu={(e) => decrementDice(e, 'd3')}
                >
                    d3
                </button>
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d4')}
                    onContextMenu={(e) => decrementDice(e, 'd4')}
                >
                    d4
                </button>
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d6')}
                    onContextMenu={(e) => decrementDice(e, 'd6')}
                >
                    d6
                </button>
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d8')}
                    onContextMenu={(e) => decrementDice(e, 'd8')}
                >
                    d8
                </button>
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d10')}
                    onContextMenu={(e) => decrementDice(e, 'd10')}
                >
                    d10
                </button>
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d12')}
                    onContextMenu={(e) => decrementDice(e, 'd12')}
                >
                    d12
                </button>
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d20')}
                    onContextMenu={(e) => decrementDice(e, 'd20')}
                >
                    d20
                </button>
                <button
                    type="button"
                    className="btn-xs"
                    onClick={() => incrementDice('d100')}
                    onContextMenu={(e) => decrementDice(e, 'd100')}
                >
                    d100
                </button>
            </div>
            <div className="flex items-center gap-1">
                <button type="button" className="btn-xs" onClick={() => handleCounter('minus')}>
                    <Minus size={14} />
                </button>
                <TextInput
                    id=""
                    name=""
                    updateInput={() => {}}
                    value={rollBonus}
                    isNumber
                    disabled
                />
                <button type="button" className="btn-xs" onClick={() => handleCounter('plus')}>
                    <Plus size={14} />
                </button>
                <button type="button" className="btn-xs bg-accent! text-accent-foreground!" onClick={handleRoll}>
                    Rolar
                </button>
            </div>
        </div>
    );
}

export default DiceSelector;