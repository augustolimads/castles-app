# Sistema de Feitiços - Guia de Uso

## Estrutura de Dados

Cada feitiço deve seguir a seguinte estrutura:

```typescript
{
  id: string;           // ID único do feitiço (ex: "spell-mago-1-1")
  name: string;         // Nome do feitiço
  level: number;        // Nível do feitiço (0 a 9)
  shortDescription: string;        // Descrição breve (aparece no título do accordion)
  completeDescription: string;     // Descrição completa (aparece ao expandir o accordion)
  type: 'mago' | 'clerigo' | 'druida';  // Tipo de conjurador
}
```

## Como Adicionar Feitiços

### Opção 1: Editar diretamente o arquivo TypeScript

Edite o arquivo `/src/modules/feiticos/feiticos.ts` e adicione novos feitiços ao array `spells`:

```typescript
export const spells: Spell[] = [
  {
    id: "spell-mago-1-1",
    name: "Detectar Magia",
    level: 1,
    shortDescription: "Detecta objetos mágicos em um raio de 18 metros",
    completeDescription: "O conjurador pode detectar objetos encantados...",
    type: "mago"
  },
  // Adicione mais feitiços aqui
];
```

### Opção 2: Importar de JSON

1. Crie um arquivo JSON seguindo a estrutura de exemplo em `/public/spells-example.json`
2. Importe e use no arquivo `feiticos.ts`:

```typescript
import spellsData from '@/public/spells-example.json';

export const spells: Spell[] = spellsData;
```

## Convenções de ID

Recomendamos seguir o padrão:
- `spell-{tipo}-{nivel}-{numero}`
- Exemplo: `spell-mago-1-1`, `spell-clerigo-2-5`, `spell-druida-0-1`

## Níveis de Magia

- **Nível 0**: Truques (cantrips) - magias menores que podem ser conjuradas sem limite
- **Níveis 1-9**: Magias progressivamente mais poderosas

## Tipos de Conjurador

- **mago**: Magias arcanas, focadas em controle e dano
- **clerigo**: Magias divinas, focadas em cura e proteção
- **druida**: Magias naturais, focadas em natureza e transformação

## Estrutura da Página

A página `/feiticos` organiza automaticamente as magias:
1. Abas no topo para escolher o tipo de conjurador
2. Magias agrupadas por nível (0-9)
3. Cada magia em um accordion expansível
4. Contador de feitiços por nível

## Exemplo de Uso

Visite `/feiticos` para ver a página funcionando. Use as abas para alternar entre Mago, Clérigo e Druida.
