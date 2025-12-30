import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

type Props = {
    value: boolean
    label: string
    onChange?: (checked: boolean) => void
    disabled?: boolean
    required?: boolean
}

export function LabeledCheckbox({ value, label, onChange, disabled = false, required = false }: Props) {
    return (
        <Field orientation="horizontal">
            <Checkbox
                id={`checkbox-${label.toLowerCase()}`}
                checked={value}
                disabled={disabled}
                onCheckedChange={(checked) => onChange?.(checked as boolean)}
            />
            <FieldLabel
                htmlFor={`checkbox-${label.toLowerCase()}`}
                className={`font-normal ${required ? 'text-blue-600 font-medium' : ''} ${disabled ? 'text-gray-400' : ''}`}
            >
                {label}{required ? ' *' : ''}
            </FieldLabel>
        </Field>
    )
}
