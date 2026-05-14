import { handleInputChange } from '../../appChanges';

interface ValueInputProps {
    id: string;
    label: string;
    placeholder: string;
    value?: string | number;
    disabled?: boolean;
    updateValue: (id: string, value: number) => void;
}

function ValueInput({ id, label, placeholder, value, disabled, updateValue }: ValueInputProps) {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.select();
    };

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        handleInputChange();
        const inputValue = Number((event.target as HTMLInputElement).value);
        if (!Number.isNaN(inputValue)) {
            updateValue(id, inputValue);
        }
    };

    return (
        <div className="text-left gap-2 items-center grid grid-cols-3">
            <label htmlFor={id} className="text-sm">{label}</label>
            <input
                id={id}
                className="input w-full col-span-2"
                placeholder={placeholder}
                type="number"
                value={value}
                disabled={disabled}
                onFocus={handleFocus}
                onInput={handleInput}
            />
        </div>
    );
}

export default ValueInput;