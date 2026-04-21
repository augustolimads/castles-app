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
    togglePrimary: (id: string) => void;
    score: {
        value: number;
        type: number;
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

    const isPrimary = score.type === 1;
    const isSecondary = score.type === 2;
    const showTypeNumber = isPrimary || isSecondary;

    return (
        <div>
            <div
                className={cn(
                    'card-xs flex flex-col relative',
                    isPrimary && 'border-primary!',
                    isSecondary && 'border-secondary!'
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
                        isPrimary && 'border-primary!',
                        isSecondary && 'border-secondary!'
                    )}
                    onClick={handleClick}
                >
                    {attrMod}
                </button>
                <button
                    type="button"
                    title="Alternar Tipo de Atributo"
                    aria-label="Alternar Tipo de Atributo"
                    className={cn(
                        'absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer bg-background border border-border text-xs font-semibold',
                        isPrimary && 'bg-primary border-primary text-primary-foreground',
                        isSecondary && 'bg-secondary border-secondary text-secondary-foreground'
                    )}
                    onClick={() => {
                        handleInputChange();
                        togglePrimary(id);
                        saveCharacter();
                    }}
                >
                    {showTypeNumber && score.type}
                </button>
            </div>
        </div>
    );
}

export default Attribute;