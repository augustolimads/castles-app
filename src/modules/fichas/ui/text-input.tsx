'use client';

import { handleInputChange } from '../appChanges';

interface TextInputProps {
    id: string;
    name: string;
    value: string | number;
    updateInput: (id: string, value: string | number) => void;
    list?: string[];
    isNumber?: boolean;
    disabled?: boolean;
}

function TextInput({ id, name, value, updateInput, list, isNumber, disabled }: TextInputProps) {
    return (
        <div className="flex flex-col text-left">
            <input
                id={id}
                className="input w-full pl-1"
                placeholder={name}
                list={list ? 'list' + id : undefined}
                type={isNumber ? 'number' : 'text'}
                value={value}
                disabled={disabled}
                onFocus={(e) => e.currentTarget.select()}
                onInput={(e) => {
                    handleInputChange();
                    const newValue = isNumber
                        ? Number.parseFloat(e.currentTarget.value)
                        : e.currentTarget.value;
                    updateInput(id, newValue);
                }}
            />
            {list && (
                <datalist id={'list' + id}>
                    {list.map((item) => (
                        <option key={item} value={item} />
                    ))}
                </datalist>
            )}
            <label htmlFor={id} className="text-sm">{name}</label>
        </div>
    );
}

export default TextInput;