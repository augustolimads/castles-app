# Componentes de Campo para Fichas

Componentes reutilizáveis para construção de formulários de fichas de personagem.

## Componentes Disponíveis

### FieldRow
Container que organiza um label e um campo de entrada em linha.

```tsx
<FieldRow label="Nível">
  <NumberField value={level} onChange={setLevel} min={1} max={24} />
</FieldRow>
```

**Props:**
- `label: string` - Texto do label
- `children: ReactNode` - Campo(s) de entrada
- `labelWidth?: string` - Largura do label (padrão: "w-20")

### TextField
Campo de texto simples.

```tsx
<TextField 
  value={description} 
  onChange={setDescription} 
  placeholder="Descrição do personagem"
/>
```

**Props:**
- `value: string` - Valor atual
- `onChange: (value: string) => void` - Callback de mudança
- `placeholder?: string` - Texto placeholder
- `className?: string` - Classes CSS (padrão: "flex-1")

### NumberField
Campo numérico com controles de min/max.

```tsx
<NumberField 
  value={level} 
  onChange={setLevel} 
  min={1} 
  max={24} 
/>
```

**Props:**
- `value: number` - Valor atual
- `onChange: (value: number) => void` - Callback de mudança
- `min?: number` - Valor mínimo
- `max?: number` - Valor máximo
- `className?: string` - Classes CSS (padrão: "flex-1")

### SelectField
Dropdown select com busca.

```tsx
<SelectField 
  value={charClass} 
  onChange={setCharClass} 
  options={charClasses}
  placeholder="Selecione a classe"
/>
```

**Props:**
- `value: string` - ID da opção selecionada
- `onChange: (value: string) => void` - Callback de mudança
- `options: Array<{ id: string; name: string }>` - Lista de opções
- `placeholder?: string` - Texto placeholder (padrão: "Selecione...")
- `className?: string` - Classes CSS (padrão: "flex-1")

## Exemplo Completo

```tsx
'use client';

import { useState } from "react";
import { charClasses } from "@/modules/data/charClasses";
import { FieldRow, NumberField, SelectField, TextField } from "@/modules/fichas/ui/field-components";

export default function MySheet() {
  const [level, setLevel] = useState(1);
  const [charClass, setCharClass] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="space-y-2">
      <FieldRow label="Nome">
        <TextField value={name} onChange={setName} />
      </FieldRow>
      
      <FieldRow label="Nível">
        <NumberField value={level} onChange={setLevel} min={1} max={24} />
      </FieldRow>
      
      <FieldRow label="Classe">
        <SelectField 
          value={charClass} 
          onChange={setCharClass} 
          options={charClasses}
        />
      </FieldRow>
    </div>
  );
}
```

## Padrões de Uso

### Campos Múltiplos na Mesma Linha
```tsx
<FieldRow label="XP">
  <NumberField value={xpCurrent} onChange={setXpCurrent} min={0} />
  <NumberField value={xpNext} onChange={setXpNext} min={0} />
</FieldRow>
```

### Label Customizado
```tsx
<FieldRow label="Alinhame." labelWidth="w-24">
  <SelectField value={alignment} onChange={setAlignment} options={alignmentOptions} />
</FieldRow>
```

## Dados Disponíveis

### Classes de Personagem
```tsx
import { charClasses } from "@/modules/data/charClasses";
// Opções: Bárbaro, Bardo, Cavaleiro, Clérigo, Combatente, Druida, 
// Explorador, Ilusionista, Lutador, Mago, Paladino, Trapaceiro, Assassino
```

### Raças de Personagem
```tsx
import { charRaces } from "@/modules/data/charRaces";
// Opções: Humano, Anão, Elfo, Gnomo, Pequenino, Meio-Elfo, Meio-Orc
```

### Alinhamentos
```tsx
const alignmentOptions = [
  { id: "bom", name: "Bom" },
  { id: "mau", name: "Mau" },
  { id: "neutro", name: "Neutro" },
  { id: "caotico", name: "Caótico" },
  { id: "ordeiro", name: "Ordeiro" },
];
```
