import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type TextInputProps = {
    label: string
    id: string
    value?: string
    disabled?: boolean
}

type NumberInputProps = {
    label: string
    id: string
    value?: number
    disabled?: boolean
}

export function TextInput({label, id, value, disabled}: TextInputProps) {
    return (
        <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor={id}>{label}</Label>
            <Input type="text" id={id} placeholder={label} value={value} disabled={disabled} />
        </div>
    )
}

export function NumberInput({label, id, value, disabled}: NumberInputProps) {
    return (
        <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor={id}>{label}</Label>
            <Input type="number" id={id} placeholder={label} value={value} disabled={disabled} />
        </div>
    )
}
