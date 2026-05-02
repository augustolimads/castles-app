# Plano de Migração: localStorage → Supabase com Sincronização Offline-First

> **Objetivo:** Implementar sistema de sincronização entre localStorage (offline) e Supabase (nuvem) para persistência de dados do usuário, mantendo funcionalidade completa offline com sync automática em background e manual sob demanda.

---

## 📊 Status Geral

| Fase | Status | Progresso | Documentação |
|------|--------|-----------|--------------|
| **Fase 0** | ✅ Concluída | 100% | [fase-0-refatoracao-localstorage.md](./fase-0-refatoracao-localstorage.md) |
| **Fase 1** | ✅ Concluída | 100% | [supabase-setup-guia.md](./supabase-setup-guia.md) |
| **Fase 2** | ✅ Concluída | 100% | - |
| **Fase 3** | 🔲 Pendente | 0% | - |
| **Fase 4** | 🔲 Pendente | 0% | - |
| **Fase 5** | 🔲 Pendente | 0% | - |
| **Fase 6** | 🔲 Pendente | 0% | - |

**Legenda:** ✅ Concluída | 🚧 Em Progresso | 🔲 Pendente | ⏸️ Pausada

---

## 🎯 Contexto e Decisões

### Dados a Sincronizar
- ✅ **Fichas de personagens** - formato unificado `castles-character-data-{id}` (character + spells + inventory + timestamp)
- ⏳ **Containers** - `containers-data`
- ⏳ **Kits do carrinho** - `cart-kits`
- ⏳ **Itens ocultos** - `hidden_items`
- ⏳ **Favoritos do compêndio** - `compendium-favorites`
- ⏳ **Configurações** - `app-config`
- ⏳ **Rastreador de tempo** - `tempo_*`
- ❌ **Carrinho atual** - sessionStorage (excluído, temporário por natureza)

### Decisões Técnicas

**Autenticação:** Supabase Auth com Magic Link (passwordless)
- ✅ Sem senhas para gerenciar, UX simples
- ✅ Supabase envia emails automaticamente
- ✅ Plano gratuito: 50k usuários/mês

**Estratégia de Conflitos:** Last-write-wins (timestamp mais recente)
- ✅ Simplicidade de implementação
- ✅ Adequado para uso típico (um usuário, múltiplos dispositivos)
- ⚠️ Sem merge complexo (pode ser adicionado futuramente)

**Schema de Dados:** JSONB genérico
- ✅ Tabela `user_data` com coluna JSONB (chave-valor)
- ✅ Flexibilidade - adicionar dados sem migrations
- ✅ Performance adequada (~10-50 registros por usuário)

**Frequência de Sync:**
- ✅ Manual via botão (sob demanda)
- ✅ Automática em background (2-5min quando online)
- ✅ Pausa quando offline ou deslogado

**Plano Supabase:**
- ✅ Gratuito para começar (500 MB storage, 2 GB bandwidth/mês)
- ✅ Estima-se 50-100 KB por usuário → 5k-10k usuários ativos
- ⏳ Realtime desabilitado (polling funciona)

---

## � Comportamento de Sincronização Multi-dispositivo

### Como Funciona o Merge Bidirecional

O sistema **preserva dados únicos** de cada dispositivo e **resolve conflitos** por timestamp:

```
📱 Cenário: Usuário com 2 computadores

┌─────────────────────────────────────────────────────────────┐
│ COMPUTADOR A (offline)                                      │
│ - Personagens: X, Y, Z                                      │
│ └─ Faz login → sincroniza                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ ☁️  SUPABASE (nuvem)                                         │
│ - Personagens: X, Y, Z                                      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ COMPUTADOR B (offline)                                      │
│ - Personagens: A, B, C                                      │
│ └─ Faz login → sincroniza                                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ ✅ RESULTADO FINAL (merge, não replace)                     │
│                                                             │
│ Computador A: X, Y, Z, A, B, C  (6 personagens)            │
│ Supabase:     X, Y, Z, A, B, C  (6 personagens)            │
│ Computador B: X, Y, Z, A, B, C  (6 personagens)            │
└─────────────────────────────────────────────────────────────┘
```

### Regras de Sincronização

✅ **Dados únicos são preservados**
- Cada personagem tem ID única (`castles-character-data-{uuid}`)
- Sincronizar não substitui tudo, apenas faz merge
- Exemplo: 3 personagens no PC1 + 3 no PC2 = 6 em ambos após sync

⚠️ **Conflitos (mesma ID) resolvidos por timestamp**
- Se mesmo personagem editado em 2 dispositivos → prevalece o mais recente
- Estratégia: **last-write-wins** (baseado em `lastModified`)

🔄 **Sincronização é bidirecional**
- **Download:** Busca dados remotos que não existem localmente
- **Upload:** Envia dados locais que não existem remotamente
- **Merge:** Para dados duplicados, resolve por timestamp

---

## �📋 Detalhamento das Fases

### ✅ Fase 0: Refatoração do localStorage (PREPARAÇÃO)

**Status:** ✅ Concluída  
**Documentação:** [fase-0-refatoracao-localstorage.md](./fase-0-refatoracao-localstorage.md)

#### Objetivos
Refatorar estrutura de armazenamento de fichas de personagens do formato fragmentado para formato unificado, preparando para sincronização com Supabase.

#### Estrutura Antes → Depois

```diff
❌ ANTES (Fragmentado):
- castles-characters                     → Record com TODOS os personagens (pesado)
- castles-characters-spells-{id}         → Separado por ficha
- castles-characters-inventory-{id}      → Separado por ficha
= 3 operações por ficha, carrega tudo ao listar

✅ DEPOIS (Unificado):
- castles-character-data-{id}            → Tudo em uma entrada
  {
    character: CharacterState,
    spells: SpellsData,
    inventory: InventoryData,
    lastModified: timestamp
  }
= 1 operação por ficha, lazy loading
```

#### Benefícios Alcançados
- ✅ Lazy loading - só carrega ficha quando abrir
- ✅ Operação atômica (1 save/delete)
- ✅ Timestamp para controle de conflitos
- ✅ Sem dados órfãos
- ✅ Pronto para Supabase (1 localStorage entry = 1 DB row)

#### Arquivos Criados/Modificados
- ✅ `src/modules/fichas/types.ts` - schema unificado
- ✅ `src/modules/fichas/migration.ts` - utilitário de migração
- ✅ `src/modules/fichas/StorageMigration.tsx` - migração automática
- ✅ `src/modules/fichas/stores/character.ts` - refatorado
- ✅ `src/modules/fichas/use-sheets.tsx` - atualizado
- ✅ `src/app/layout.tsx` - incluído StorageMigration

---

### ✅ Fase 1: Infraestrutura Supabase

**Status:** ✅ Concluída  
**Dependências:** Fase 0 ✅  
**Estimativa:** 2-3 horas  
**Documentação:** [supabase-setup-guia.md](./supabase-setup-guia.md)

#### Objetivos
Configurar projeto Supabase, instalar dependências, modelar banco de dados e configurar autenticação passwordless.

#### Arquivos Criados
- ✅ `.env.local` - variáveis de ambiente (não commitado)
- ✅ `.env.example` - template de variáveis de ambiente
- ✅ `src/lib/supabase/client.ts` - cliente Supabase singleton
- ✅ `src/lib/supabase/types.ts` - tipos TypeScript do schema
- ✅ `docs/supabase-schema.sql` - schema SQL completo
- ✅ `docs/supabase-setup-guia.md` - guia passo a passo

#### Próximos Passos
Para completar a configuração:
1. Criar projeto no Supabase Dashboard (manual)
2. Executar script SQL `docs/supabase-schema.sql` (manual)
3. Copiar credenciais para `.env.local` (manual)
4. Configurar autenticação e URLs (manual)

**Guia completo:** [supabase-setup-guia.md](./supabase-setup-guia.md)

---

### ✅ Fase 2: Sistema de Autenticação

**Status:** ✅ Concluída  
**Dependências:** Fase 1 ✅  
**Estimativa:** 3-4 horas

#### Objetivos
Implementar módulo de autenticação, UI no sidebar (login/logout), e indicador de status de sincronização.

#### Arquivos Criados
- ✅ `src/modules/auth/use-auth.tsx` - Store Zustand + AuthProvider
- ✅ `src/modules/config/ui/auth-menu.tsx` - Menu de autenticação com dropdown
- ✅ `src/modules/config/ui/auth-login-dialog.tsx` - Dialog de login com magic link
- ✅ `src/modules/config/ui/sync-status-button.tsx` - Botão de status de sincronização
- ✅ `src/lib/sync/sync-status-store.ts` - Store Zustand para status de sync (Fase 3)
- ✅ `src/app/auth/callback/route.ts` - Rota de callback do Supabase Auth

#### Arquivos Modificados
- ✅ `src/modules/config/ui/index.tsx` - Exporta AuthMenu e SyncStatusButton
- ✅ `src/modules/manager/ui/app-sidebar.tsx` - Integra componentes no footer
- ✅ `src/app/layout.tsx` - Adiciona AuthProvider

#### Funcionalidades Implementadas
- ✅ Autenticação passwordless com magic link
- ✅ Detecção automática de sessão (persistência)
- ✅ Listener de mudanças de autenticação
- ✅ UI de login com validação de email
- ✅ Menu dropdown com avatar/email quando logado
- ✅ Botão de status de sincronização (placeholder para Fase 3)
- ✅ Detecção de status online/offline
- ✅ Toast notifications para feedback do usuário

---

### 🔲 Fase 3: Camada de Sincronização

**Status:** 🔲 Pendente  
**Dependências:** Fase 1 ✅ e Fase 2 ✅  
**Estimativa:** 5-6 horas

#### Objetivos
Criar sistema de sincronização bidirecional (localStorage ↔ Supabase) com fila de operações, resolução de conflitos e wrapper transparente.

#### Tasks

##### 3.1 Criar Abstração de Sincronização

- [ ] Criar `src/lib/sync/types.ts`:
  ```typescript
  type SyncStatus = 'idle' | 'syncing' | 'synced' | 'pending' | 'error' | 'offline';
  
  interface SyncOperation {
    id: string;
    dataKey: string;
    action: 'upsert' | 'delete';
    data?: any;
    timestamp: number;
  }
  
  interface SyncQueueItem extends SyncOperation {
    retries: number;
    lastError?: string;
  }
  ```

- [ ] Criar `src/lib/sync/sync-status-store.ts` - Zustand store:
  ```typescript
  interface SyncStatusStore {
    status: SyncStatus;
    lastSync: number | null;
    pendingChanges: number;
    currentOperation: string | null;
    setStatus: (status: SyncStatus) => void;
    // ... outros métodos
  }
  ```

- [ ] Criar `src/lib/sync/sync-queue.ts`:
  - `addToQueue(operation)` - adiciona operação pendente
  - `getQueue()` - retorna fila
  - `removeFromQueue(id)` - remove após sync
  - `clearQueue()` - limpa fila
  - Salvar fila em `localStorage` (`sync-queue`)

- [ ] Criar `src/lib/sync/sync-conflict-resolver.ts`:
  - `resolveConflict(local, remote)` - last-write-wins via timestamp
  - Logs para debug de conflitos

##### 3.2 Implementar Sync Engine

- [ ] Criar `src/lib/sync/sync-manager.ts`:
  
  **Funções principais:**
  ```typescript
  // Push para nuvem
  async function syncToCloud(dataKey: string, data: any): Promise<void>
  
  // Pull da nuvem
  async function syncFromCloud(dataKey: string): Promise<any>
  
  // Sync completa (todas as chaves) - MERGE BIDIRECIONAL
  // IMPORTANTE: Não sobrescreve dados únicos em multi-dispositivo
  // Exemplo: PC1 tem personagens X,Y,Z → sincroniza
  //          PC2 tem personagens A,B,C → sincroniza
  //          Resultado: AMBOS têm X,Y,Z,A,B,C (merge, não replace)
  async function fullSync(): Promise<void>
  
  // Adicionar à fila quando offline
  function queueChange(key: string, data: any): void
  
  // Processar fila pendente
  async function processSyncQueue(): Promise<void>
  ```
  
  **Lógica da fullSync() - MERGE BIDIRECIONAL:**
  ```typescript
  async function fullSync(): Promise<void> {
    // 1. Buscar TODAS as chaves do servidor
    const remoteData = await fetchAllUserData();
    
    // 2. Buscar TODAS as chaves locais sincronizáveis
    const localKeys = getAllSyncableKeys();
    
    // 3. DOWNLOAD: Para cada chave remota
    for (const remote of remoteData) {
      const local = getLocalData(remote.data_key);
      
      if (!local) {
        // Não existe local → baixar do servidor
        saveToLocalStorage(remote);
      } else {
        // Existe local E remoto → resolver conflito por timestamp
        if (remote.updated_at > local.lastModified) {
          saveToLocalStorage(remote); // Remoto mais recente
        }
        // Se local mais recente, mantém local e envia depois
      }
    }
    
    // 4. UPLOAD: Para cada chave local que NÃO está no servidor
    for (const localKey of localKeys) {
      const existsRemote = remoteData.some(r => r.data_key === localKey);
      
      if (!existsRemote) {
        // Existe local mas não remoto → enviar para servidor
        await syncToCloud(localKey, getLocalData(localKey));
      }
    }
  }
  ```
  
  **Comportamento geral:**
  - Verificar se está online (`navigator.onLine`)
  - Verificar se está autenticado (`use-auth`)
  - **Merge bidirecional:** preserva dados únicos de ambos os lados
  - **Conflitos (mesma chave):** resolver via timestamp (last-write-wins)
  - Retry com exponential backoff (3 tentativas)
  - Atualizar `sync-status-store` durante processo

##### 3.3 Wrapper de localStorage com Sync

- [ ] Criar `src/lib/sync/synced-local-storage.ts`:
  
  ```typescript
  /**
   * Wrapper transparente do localStorage que enfileira mudanças para sync
   */
  export const syncedLocalStorage = {
    getItem(key: string): string | null {
      return localStorage.getItem(key);
    },
    
    setItem(key: string, value: string): void {
      localStorage.setItem(key, value);
      
      // Se online e autenticado, sync imediato
      // Se offline, adicionar à fila
      if (shouldSync(key)) {
        queueChange(key, value);
      }
    },
    
    removeItem(key: string): void {
      localStorage.removeItem(key);
      queueChange(key, null); // null = delete
    }
  };
  ```

##### 3.4 Integrar com Módulos Existentes

**Fichas de personagens:**
- [ ] `src/modules/fichas/stores/character.ts`:
  - `saveCharacterToStorage()` → usar `syncToCloud()` após salvar
  - `deleteCharacterFromStorage()` → usar `syncToCloud()` com delete

**Outros módulos:**
- [ ] `src/modules/containers/use-containers.tsx` - wrapper no save
- [ ] `src/modules/itens/kits.ts` - wrapper em `saveCartKit`, `deleteSavedCartKit`
- [ ] `src/modules/compendium/use-favorites.tsx` - wrapper no save
- [ ] `src/modules/itens/use-hidden-items.tsx` - wrapper em `saveHiddenItemIds`
- [ ] `src/hooks/use-config.ts` - integrar Zustand persist com sync
- [ ] `src/app/tempo/page.tsx` - wrapper nos setItem

#### Arquivos a Criar
- `src/lib/sync/types.ts`
- `src/lib/sync/sync-status-store.ts`
- `src/lib/sync/sync-queue.ts`
- `src/lib/sync/sync-conflict-resolver.ts`
- `src/lib/sync/sync-manager.ts`
- `src/lib/sync/synced-local-storage.ts`

#### Arquivos a Modificar
- `src/modules/fichas/stores/character.ts`
- `src/modules/containers/use-containers.tsx`
- `src/modules/itens/kits.ts`
- `src/modules/compendium/use-favorites.tsx`
- `src/modules/itens/use-hidden-items.tsx`
- `src/hooks/use-config.ts`
- `src/app/tempo/page.tsx`

#### Verificação
- [ ] Salvar ficha offline → adiciona à fila
- [ ] Voltar online → processa fila automaticamente
- [ ] Editar ficha online → sync imediato
- [ ] Status button mostra "sincronizando" durante sync
- [ ] Conflitos resolvidos corretamente (last-write-wins)
- [ ] **Multi-dispositivo:** Dados únicos de cada dispositivo são preservados (merge, não replace)
  - Criar personagens X,Y,Z no PC1 → sincronizar
  - Criar personagens A,B,C no PC2 → sincronizar
  - Verificar que ambos os PCs têm todos os 6 personagens após sync

---

### 🔲 Fase 4: Sincronização Automática e Listeners

**Status:** 🔲 Pendente  
**Dependências:** Fase 3 ✅  
**Estimativa:** 2-3 horas

#### Objetivos
Implementar sync automática em background (polling periódico), sync na reconexão e ao fazer login.

#### Tasks

##### 4.1 Sync Automática em Background

- [ ] Criar `src/hooks/use-sync-scheduler.tsx`:
  ```typescript
  export function useSyncScheduler() {
    // Timer: sync a cada 2-5 minutos
    // Apenas se online E autenticado
    // Pausar quando offline ou deslogado
    
    useEffect(() => {
      const interval = setInterval(() => {
        if (isOnline && isAuthenticated) {
          processSyncQueue();
        }
      }, 3 * 60 * 1000); // 3 minutos
      
      return () => clearInterval(interval);
    }, [isOnline, isAuthenticated]);
  }
  ```
- [ ] Adicionar `<SyncScheduler />` no `layout.tsx`

##### 4.2 Sync na Reconexão e Login

- [ ] Listener de eventos `online`/`offline`:
  ```typescript
  window.addEventListener('online', () => {
    console.log('[Sync] Voltou online, processando fila...');
    processSyncQueue();
  });
  ```

- [ ] Trigger `fullSync()` ao fazer login:
  ```typescript
  // Em use-auth.tsx
  onAuthStateChange((session) => {
    if (session) {
      fullSync(); // Sync completa ao logar
    }
  });
  ```

- [ ] Mostrar toast durante sync inicial:
  - "Sincronizando dados..." com progress
  - "Sincronização concluída! X itens atualizados"

##### 4.3 Listeners de Mudanças Remotas (Opcional - Fase Futura)

⚠️ **Requer plano pago do Supabase**

- [ ] Supabase Realtime para broadcast entre dispositivos:
  ```typescript
  supabase
    .channel('user_data_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'user_data' },
      (payload) => {
        // Auto-atualizar localStorage quando outro dispositivo fizer mudanças
      }
    )
    .subscribe();
  ```

**Decisão:** Implementar apenas na v2 se houver demanda (por enquanto, polling a cada 3min é suficiente)

#### Arquivos a Criar
- `src/hooks/use-sync-scheduler.tsx`

#### Arquivos a Modificar
- `src/app/layout.tsx` - adicionar SyncScheduler
- `src/modules/auth/use-auth.tsx` - trigger fullSync ao logar

#### Verificação
- [ ] Sync automática executa a cada 3 minutos
- [ ] Ao voltar online, fila é processada imediatamente
- [ ] Ao fazer login, fullSync executa
- [ ] Toast de progresso aparece durante sync longa
- [ ] Pausar timer quando deslogado

---

### 🔲 Fase 5: Migração de Dados Existentes

**Status:** 🔲 Pendente  
**Dependências:** Fase 3 ✅  
**Estimativa:** 2 horas

#### Objetivos
Migrar dados locais existentes para a nuvem no primeiro login, com confirmação do usuário.

#### Tasks

##### 5.1 Utilitário de Migração para Nuvem

- [ ] Criar `src/lib/sync/cloud-migration.ts`:
  ```typescript
  /**
   * Detecta se há dados locais e nenhum dado na nuvem
   */
  async function needsCloudMigration(): Promise<boolean>
  
  /**
   * Migra todos os dados locais para Supabase
   */
  async function migrateLocalDataToCloud(): Promise<{
    success: boolean;
    migratedKeys: string[];
    errors: string[];
  }>
  ```

##### 5.2 Modal de Confirmação

- [ ] Criar `src/modules/auth/cloud-migration-dialog.tsx`:
  - Título: "Sincronizar dados com a nuvem?"
  - Mensagem: "Encontramos X fichas e dados salvos localmente. Deseja enviar para a nuvem?"
  - Botões: "Sim, sincronizar" | "Agora não"
  - Progress bar durante upload
  - Contagem: "Enviando 3 de 10 itens..."

##### 5.3 Trigger no Primeiro Login

- [ ] No `use-auth.tsx`, ao detectar primeiro login:
  ```typescript
  if (isFirstLogin && await needsCloudMigration()) {
    // Mostrar modal de confirmação
    setShowMigrationDialog(true);
  }
  ```

- [ ] Após migração bem-sucedida:
  - Salvar flag `cloud-migration-completed` no localStorage
  - Não mostrar modal novamente

#### Arquivos a Criar
- `src/lib/sync/cloud-migration.ts`
- `src/modules/auth/cloud-migration-dialog.tsx`

#### Arquivos a Modificar
- `src/modules/auth/use-auth.tsx` - trigger de migração

#### Verificação
- [ ] Usuário com dados locais faz primeiro login → modal aparece
- [ ] Aceitar migração → dados enviados para Supabase
- [ ] Recusar migração → dados permanecem locais
- [ ] Segundo login → modal não aparece mais
- [ ] Após migração, dados acessíveis em outro dispositivo

---

### 🔲 Fase 6: Testes e Polimento

**Status:** 🔲 Pendente  
**Dependências:** Fase 4 ✅ e Fase 5 ✅  
**Estimativa:** 3-4 horas

#### Objetivos
Testar todos os fluxos, adicionar tratamento de erros, melhorar feedback visual e documentar.

#### Tasks

##### 6.1 Testes de Fluxos Principais

- [ ] **Cadastro/Login:**
  - Enviar magic link
  - Clicar no link → login automático
  - Sessão persistir após refresh
  - Logout funcionar

- [ ] **Sync Offline → Online:**
  - Criar ficha offline
  - Desconectar internet
  - Editar ficha
  - Reconectar → sync automática
  - Verificar dados no Supabase Dashboard

- [ ] **Multi-dispositivo:**
  - Criar ficha no dispositivo A
  - Login no dispositivo B → ficha aparece
  - Editar no B → mudanças aparecem no A após sync
  - **Teste de merge:** Criar personagens X,Y,Z no dispositivo A offline, criar personagens A,B,C no dispositivo B offline, sincronizar ambos → todos os 6 personagens devem aparecer em ambos os dispositivos

- [ ] **Conflitos:**
  - Editar mesma ficha em 2 dispositivos offline
  - Voltar online → última edição vence (last-write-wins)

- [ ] **Funcionalidade Offline:**
  - Desconectar internet
  - Todas as features funcionam normalmente
  - Criar/editar/deletar fichas
  - Mudanças enfileiradas

- [ ] **Migração de Dados:**
  - Usuário com dados locais → modal no primeiro login
  - Dados migram corretamente
  - Flag impede duplicação

##### 6.2 Tratamento de Erros

- [ ] Erro de rede → retry com exponential backoff
- [ ] Erro de autenticação → forçar relogin
- [ ] Erro do Supabase → toast de erro amigável
- [ ] Timeout → adicionar à fila e tentar depois
- [ ] Conflito complexo → log detalhado para debug

##### 6.3 Melhorias de UX

- [ ] Toast de feedback:
  - "Sincronizando..."
  - "Sincronização concluída!"
  - "Erro ao sincronizar, tentando novamente..."
  
- [ ] Loading states:
  - Skeleton na lista de fichas durante carregamento
  - Spinner no botão de sync
  
- [ ] Indicadores visuais:
  - Badge "pendente" em itens não sincronizados
  - Progress bar durante sync longa

##### 6.4 Documentação

- [ ] Atualizar `README.md`:
  - Seção "Setup do Supabase"
  - Variáveis de ambiente necessárias
  - Instruções de deploy

- [ ] Criar `.env.example`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxx
  ```

- [ ] Documentar fluxo de sync (diagrama opcional)

- [ ] Comentários no código (JSDoc)

##### 6.5 Deploy e Testes em Produção

- [ ] Deploy no Vercel
- [ ] Atualizar URLs no Supabase (prod)
- [ ] Testar em produção:
  - Magic link funciona
  - Sync funciona
  - Performance aceitável

#### Arquivos a Criar
- `.env.example`
- Documentação adicional (opcional)

#### Arquivos a Modificar
- `README.md` - instruções de setup

#### Verificação
- [ ] Todos os fluxos testados e funcionando
- [ ] Erros tratados adequadamente
- [ ] Feedback visual claro
- [ ] Documentação completa
- [ ] Deploy em produção funcionando

---

## 📈 Métricas de Sucesso

Ao final da implementação, o sistema deve:

✅ **Funcionalidade:**
- Sincronização bidirecional (localStorage ↔ Supabase)
- Funcionalidade completa offline
- Multi-dispositivo funcional
- Conflitos resolvidos automaticamente

✅ **UX:**
- Login simples (magic link)
- Feedback visual claro (status de sync)
- Sem perda de dados
- Performance aceitável (<3s para sync completa)

✅ **Técnico:**
- Código limpo e documentado
- Sem regressões
- Testes passando
- Deploy em produção estável

---

## 🔮 Melhorias Futuras (Pós-MVP)

Após completar todas as fases, considerar:

1. **Realtime Sync** (requer plano Pro)
   - Broadcast instantâneo entre dispositivos
   - Polling a cada 30-60s quando app aberto
   - Usar Supabase Realtime

2. **Sistema de Backup/Export**
   - Botão "Exportar dados" (JSON download)
   - Botão "Importar dados" (JSON upload)
   - Útil para backup manual e GDPR compliance

3. **Histórico de Versões**
   - Manter versões anteriores de fichas
   - Permitir rollback
   - Útil para recuperação de dados

4. **Compartilhamento de Fichas**
   - Compartilhar ficha com outro usuário
   - Permissões: visualizar, editar
   - Links de compartilhamento

5. **Otimizações de Performance**
   - Sync incremental (apenas campos alterados)
   - Compressão de dados JSONB
   - Paginação na listagem

---

## 📞 Suporte

**Problemas comuns e soluções:**

**Erro: "Invalid API key"**
- Verificar `.env.local` está configurado
- Confirmar que variáveis começam com `NEXT_PUBLIC_`
- Reiniciar servidor dev

**Magic link não chega:**
- Verificar spam
- Confirmar email no Supabase Dashboard → Authentication
- Verificar templates de email

**Dados não sincronizam:**
- Verificar RLS ativo e políticas corretas
- Confirmar autenticação bem-sucedida
- Checar console para erros
- Verificar fila de sync (`sync-queue` no localStorage)

**Conflitos persistentes:**
- Verificar timestamps das modificações
- Logs do `sync-conflict-resolver.ts`
- Forçar sync manual pelo botão

**Comportamento multi-dispositivo:**
- ✅ **Dados únicos são preservados:** Se PC1 tem personagens X,Y,Z e PC2 tem personagens A,B,C, após sincronizar ambos terão todos os 6 personagens
- ⚠️ **Conflitos por chave:** Se o mesmo personagem (mesma ID) foi editado em 2 lugares, prevalece a versão com timestamp mais recente
- 💡 **Dica:** Cada personagem tem sua própria chave única (`castles-character-data-{id}`), então sincronizações de diferentes dispositivos fazem **merge**, não substituição completa

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

---

## 🔄 Resumo das Mudanças da Fase 0

A Fase 0 refatorou completamente a estrutura de armazenamento de fichas:

**Antes (Fragmentado):**
```
castles-characters                  → TODOS os personagens juntos
castles-characters-spells-{id}      → Separado por ficha
castles-characters-inventory-{id}   → Separado por ficha
```

**Depois (Unificado):**
```
castles-character-data-{id} → {
  character: CharacterState,
  spells: SpellsData,
  inventory: InventoryData,
  lastModified: timestamp
}
```

**Impacto no plano:**
- ✅ Simplifica sincronização com Supabase (1 localStorage entry = 1 DB row)
- ✅ Timestamp já disponível para resolução de conflitos
- ✅ Lazy loading implementado (melhor performance)
- ✅ Base sólida para as próximas fases

---

**Última atualização:** Fase 0 concluída em 02/05/2026 | Fase 1 concluída em 02/05/2026 | Fase 2 concluída em 02/05/2026  
**Próximo passo:** Iniciar Fase 3 - Camada de Sincronização
