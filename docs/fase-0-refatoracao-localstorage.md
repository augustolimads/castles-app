# Fase 0: Refatoração do localStorage - Concluída ✅

## Resumo das Mudanças

A estrutura de armazenamento de fichas de personagens foi refatorada de um formato fragmentado para um formato unificado, melhorando performance, consistência e preparando o terreno para sincronização com Supabase.

---

## Estrutura Anterior (Fragmentada) ❌

```typescript
// Metadata de todas as fichas
localStorage["castles-character-sheets"] = [
  { id: "sheet-1", name: "Gandalf", ... },
  { id: "sheet-2", name: "Aragorn", ... }
]

// TODOS os personagens em um único objeto
localStorage["castles-characters"] = {
  "sheet-1": { id: "sheet-1", name: "Gandalf", ... },
  "sheet-2": { id: "sheet-2", name: "Aragorn", ... }
}

// Spells e Inventory separados por ID
localStorage["castles-characters-spells-sheet-1"] = { level: {...}, known: [...] }
localStorage["castles-characters-inventory-sheet-1"] = { weapons: [...], ... }
```

**Problemas:**
- Ao listar fichas, carregava automaticamente TODOS os personagens (mesmo sem abrir nenhum)
- 3 operações de localStorage por ficha
- Risco de dados órfãos ao deletar
- Dificulta sincronização com Supabase

---

## Estrutura Nova (Unificada) ✅

```typescript
// Metadata para listagem rápida (unchanged)
localStorage["castles-character-sheets"] = [
  { id: "sheet-1", name: "Gandalf", ... },
  { id: "sheet-2", name: "Aragorn", ... }
]

// UMA entrada por ficha com TUDO
localStorage["castles-character-data-sheet-1"] = {
  character: { id: "sheet-1", name: "Gandalf", ... },
  spells: { level: {...}, known: [...] },
  inventory: { weapons: [...], equipments: [...], items: [...] },
  lastModified: 1714521600000
}

localStorage["castles-character-data-sheet-2"] = {
  character: { id: "sheet-2", name: "Aragorn", ... },
  spells: { level: {...}, known: [...] },
  inventory: { weapons: [...], equipments: [...], items: [...] },
  lastModified: 1714521700000
}
```

**Benefícios:**
- ✅ Lazy loading: só carrega ficha quando abrir
- ✅ 1 operação de localStorage por ficha (atômico)
- ✅ Timestamp único para controle de conflitos
- ✅ Deletar é simples e completo
- ✅ Pronto para sincronizar com Supabase (1 operação)

---

## Arquivos Criados

### 1. **src/modules/fichas/types.ts** (atualizado)
- Adicionados tipos: `CharacterState`, `SpellsData`, `InventoryData`, `CharacterData`
- Interface `CharacterData` unifica character + spells + inventory + timestamp

### 2. **src/modules/fichas/migration.ts** (novo)
- `isMigrationNeeded()` - verifica se há dados antigos
- `migrateCharacterStorageFormat()` - converte formato antigo → novo
- `rollbackMigration()` - volta para formato antigo (emergência/teste)
- Limpeza automática de chaves antigas após migração

### 3. **src/modules/fichas/StorageMigration.tsx** (novo)
- Componente React que executa migração automaticamente no boot
- Silencioso (não bloqueia UI)
- Logs no console para debug

---

## Arquivos Modificados

### 1. **src/modules/fichas/stores/character.ts**
**Mudanças:**
- Novo prefixo: `CHARACTER_DATA_KEY_PREFIX = 'castles-character-data-'`
- `saveCharacterToStorage()` → salva formato unificado (1 operação)
- `loadCharacterFromStorage()` → carrega do formato unificado
- `loadCharacterData()` → nova função para carregar dados completos
- `deleteCharacterFromStorage()` → deleta apenas 1 entrada
- `getCharacterTimestamp()` → nova função para obter lastModified
- Removido `getCharactersFromStorage()` (não carrega todos de uma vez)

### 2. **src/modules/fichas/use-sheets.tsx**
**Mudanças:**
- Comentários atualizados para explicar novo formato
- Lógica permanece igual (já usava funções refatoradas)

### 3. **src/app/layout.tsx**
**Mudanças:**
- Importado `StorageMigration`
- Adicionado `<StorageMigration />` no body (executa automaticamente)

---

## Migração Automática

A migração acontece **automaticamente na primeira vez** que o app é carregado após a atualização:

1. **Detecção:** Verifica se existe `castles-characters` (formato antigo)
2. **Conversão:** Para cada personagem:
   - Lê character de `castles-characters`
   - Lê spells de `castles-characters-spells-{id}`
   - Lê inventory de `castles-characters-inventory-{id}`
   - Salva tudo junto em `castles-character-data-{id}`
3. **Limpeza:** Remove chaves antigas após migração bem-sucedida
4. **Flag:** Marca `storage-migration-completed = true` (não repete)

**Logs no console:**
```
[StorageMigration] Migration needed, starting...
[Migration] Found 5 characters to migrate
[Migration] Migrated character: sheet-123 (Gandalf)
[Migration] Completed! Migrated 5 characters with 0 errors
```

---

## Como Testar

### 1. Migração Automática
- Abra o app com dados existentes
- Console mostrará logs de migração
- Verifique no DevTools → Application → localStorage:
  - ✅ Devem existir entradas `castles-character-data-{id}`
  - ✅ Não devem existir `castles-characters`, `castles-characters-spells-*`, etc
  - ✅ Deve existir flag `storage-migration-completed = true`

### 2. Funcionalidade
- **Listar fichas:** Abra `/fichas` → deve mostrar todas as fichas
- **Criar ficha:** Crie uma nova → deve salvar no formato unificado
- **Editar ficha:** Abra uma ficha, edite e salve → deve funcionar normalmente
- **Deletar ficha:** Delete uma ficha → deve remover a entrada unificada

### 3. Verificação de Tamanho
No DevTools Console:
```javascript
// Ver tamanho de uma entrada
const data = localStorage.getItem('castles-character-data-sheet-123');
console.log(`Tamanho: ${new Blob([data]).size} bytes`);
// Esperado: 17-75 KB (aceitável)
```

---

## Rollback (Emergência)

Se algo der errado, você pode reverter para o formato antigo:

```javascript
// No console do navegador
import { rollbackMigration } from '@/modules/fichas/migration';
rollbackMigration();
// Recarregue a página
```

**⚠️ Atenção:** Isso só funciona se as entradas novas ainda existirem!

---

## Próximos Passos

Com a Fase 0 concluída, a estrutura de dados está otimizada para:

✅ **Fase 1:** Adicionar Supabase (1 entrada no localStorage = 1 linha no banco)  
✅ **Fase 2:** Implementar sincronização (usar `lastModified` para conflitos)  
✅ **Fase 3:** Autenticação e UI de sync  

---

## Verificação de Sucesso

- [x] Sem erros de compilação
- [x] Servidor dev rodando sem problemas
- [x] Migração automática implementada
- [x] Código mais limpo e performático
- [x] Pronto para próxima fase (Supabase)

**Status:** ✅ Fase 0 Completa!
