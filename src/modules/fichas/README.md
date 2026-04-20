# Sistema de Fichas de Personagens

Sistema CRUD completo para gerenciar fichas de personagens, NPCs e monstros.

## Estrutura de Dados

```typescript
interface CharacterSheet {
  id: string;              // ID único gerado automaticamente
  type: 'personagem' | 'npc' | 'monstro';
  portrait: string;        // URL da imagem do retrato
  name: string;            // Nome do personagem
  race: string;            // Raça (ex: Humano, Elfo, etc)
  class: string;           // Classe (ex: Guerreiro, Mago, etc)
  level: number;           // Nível (1-20)
  bg: string;              // URL da imagem de fundo
  createdAt: number;       // Timestamp de criação
}
```

## Funcionalidades

### ✅ Implementado

- **CRUD Completo**:
  - ✅ Create: Criar novas fichas via dialog
  - ✅ Read: Listar fichas com paginação
  - ✅ Delete: Excluir fichas com confirmação
  - ⏳ Update: A ser implementado na página de detalhes

- **Filtros por Tipo**:
  - Personagens
  - NPCs
  - Monstros

- **Interface**:
  - Cards com preview de imagem
  - Badge de tipo com cores distintas
  - Botão de exclusão (aparece ao hover)
  - Clique no card abre em nova aba
  - Paginação (12 itens por página)
  - Contador de fichas por tipo

- **Persistência**:
  - Dados salvos em localStorage
  - Sincronização automática entre abas

## Como Usar

### Página Principal
Acesse `/fichas` para ver a lista de fichas.

### Criar Nova Ficha
1. Selecione o tipo (Personagem/NPC/Monstro) nas abas
2. Clique em "Nova Ficha de [Tipo]"
3. Preencha o formulário:
   - Nome (obrigatório)
   - Raça
   - Classe
   - Nível (1-20)
   - URL do Retrato
   - URL do Background
4. Clique em "Criar Ficha"

### Visualizar Ficha
Clique no card da ficha para abrir em nova aba.
*Nota: A página de detalhes será implementada futuramente.*

### Excluir Ficha
1. Passe o mouse sobre o card
2. Clique no botão de lixeira que aparece
3. Confirme a exclusão

## Estrutura de Arquivos

```
src/modules/fichas/
├── types.ts                      # Interfaces TypeScript
├── use-sheets.tsx                # Hook de gerenciamento de estado
└── ui/
    ├── sheets-content.tsx        # Componente principal da lista
    ├── sheet-card.tsx            # Card individual de ficha
    └── create-sheet-dialog.tsx   # Dialog de criação

src/app/fichas/
├── page.tsx                      # Página da lista
└── [id]/
    └── page.tsx                  # Página de detalhes (placeholder)
```

## Próximos Passos

- [ ] Implementar página de visualização/edição da ficha completa
- [ ] Adicionar busca por nome
- [ ] Adicionar filtros adicionais (raça, classe, nível)
- [ ] Adicionar ordenação (nome, nível, data de criação)
- [ ] Sistema de upload de imagens
- [ ] Exportar/importar fichas (JSON)
- [ ] Compartilhar fichas via URL

## Dicas de Uso

### URLs de Imagem
Você pode usar serviços gratuitos para hospedar imagens:
- **Placeholder**: `https://via.placeholder.com/150`
- **Avatar Generator**: `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`
- **Unsplash**: `https://source.unsplash.com/random/400x300`

### Exemplo de Ficha
```json
{
  "type": "personagem",
  "portrait": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aragorn",
  "name": "Aragorn",
  "race": "Humano",
  "class": "Guerreiro",
  "level": 10,
  "bg": "https://source.unsplash.com/400x300/?medieval,castle"
}
```
