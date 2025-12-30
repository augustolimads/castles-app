import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface NumberInputProps {
  label: string
  id: string
  value?: number
  disabled?: boolean
  onChange?: (value: number) => void
}

export default function NumberInput({ label, id, value = 0, disabled = false, onChange }: NumberInputProps) {
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(parseInt(e.target.value) || 0)}
        placeholder={disabled ? '' : '0'}
      />
    </Field>
  )
}
