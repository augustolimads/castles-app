'use client';

import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { handleInputChange } from '../appChanges';
import { setAttributeMod, type TAttr } from '../attributeLogic';
import { saveCharacter } from '../stores/character';

interface AttributeProps {
    id: TAttr;
    name: string;
    desc: string;
    updateAttr: (id: TAttr, newValue: string) => void;
    togglePrimary: (id: string, newValue: boolean) => void;
    score: {
        value: number;
        isPrimary: boolean;
    };
}

function Attribute({ id, name, score, desc, updateAttr, togglePrimary }: AttributeProps) {
    const attrMod = useMemo(() => setAttributeMod(score.value), [score.value]);

    function handleClick() {
        // TODO: Implementar setRollDice quando o sistema de dados estiver pronto
        // setRollDice('1d20' + attrMod);
        // setDiscordTitle(name);
        console.log('Roll dice:', '1d20' + attrMod, 'for', name);
    }

    return (
        <div>
            <div
                className={cn(
                    'card-xs flex flex-col relative',
                    score.isPrimary && 'border-primary!'
                )}
            >
                <label htmlFor={id + 'Score'} className="text-xs text-center">{name}</label>
                <input
                    id={id + 'Score'}
                    className="text-4xl pb-3.5 text-center my-1 input"
                    placeholder="10"
                    value={score.value}
                    onFocus={(e) => e.currentTarget.select()}
                    onInput={(e) => {
                        handleInputChange();
                        const target = e.currentTarget;
                        updateAttr(id, target.value);
                        saveCharacter();
                    }}
                    type="number"
                    min="1"
                    max="99"
                />
                <button
                    type="button"
                    title={desc}
                    className={cn(
                        'cursor-pointer badge w-10',
                        score.isPrimary && 'border-primary!'
                    )}
                    onClick={handleClick}
                >
                    {attrMod}
                </button>
                <button
                    type="button"
                    title="Alternar Atributo Primário"
                    aria-label="Alternar Atributo Primário"
                    className={cn(
                        'absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex justify-center align-center cursor-pointer bg-background border border-border',
                        score.isPrimary && 'bg-primary border-primary'
                    )}
                    onClick={() => {
                        handleInputChange();
                        togglePrimary(id, !score.isPrimary);
                        saveCharacter();
                    }}
                >
                </button>
            </div>
        </div>
    );
}

export default Attribute;