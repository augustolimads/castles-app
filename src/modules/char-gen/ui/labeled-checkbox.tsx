import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

type Props = {
    value: boolean
    label: string
    onChange?: (checked: boolean) => void
    disabled?: boolean
    required?: boolean
    id?: string
}

export function LabeledCheckbox({ value, label, onChange, disabled = false, required = false, id }: Props) {
    const checkboxId = id || `checkbox-${label.toLowerCase()}`;

    return (
        <Field orientation="horizontal">
            <Checkbox
                id={checkboxId}
                checked={value}
                disabled={disabled}
                onCheckedChange={(checked) => onChange?.(checked as boolean)}
            />
            <FieldLabel
                htmlFor={checkboxId}
                className={`font-normal ${required ? 'text-blue-600 font-medium' : ''} ${disabled ? 'text-gray-400' : ''}`}
            >
                {label}{required ? ' *' : ''}
            </FieldLabel>
        </Field>
    )
}
