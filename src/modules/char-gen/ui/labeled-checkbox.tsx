import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

type Props = {
    value: boolean
    label: string
}

export function LabeledCheckbox({ value, label }: Props) {
    return (
        <Field orientation="horizontal">
            <Checkbox id="finder-pref-9k2-external-disks-1yg" checked={value} />
            <FieldLabel
                htmlFor="finder-pref-9k2-external-disks-1yg"
                className="font-normal"
            >
                {label}
            </FieldLabel>
        </Field>
    )
}
