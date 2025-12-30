import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TextSelectProps {
  label: string
  placeholder: string
  values: { id: string; name: string }[]
  value?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export default function TextSelect({ label, placeholder, values, value = '', disabled = false, onChange }: TextSelectProps) {
  return (
    <Field>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {values.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                  {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
