import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TextInputProps {
  label: string
  id: string
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export default function TextInput({ label, id, value = '', disabled = false, onChange }: TextInputProps) {
  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={disabled ? '' : `Digite o ${label.toLowerCase()}`}
      />
    </Field>
  )
}
