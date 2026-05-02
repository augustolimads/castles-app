# Plano de Migração: localStorage → Supabase com Sincronização Offline-First

> **Objetivo:** Implementar sistema de sincronização entre localStorage (offline) e Supabase (nuvem) para persistência de dados do usuário, mantendo funcionalidade completa offline com sync automática em background e manual sob demanda.

---

## 📊 Status Geral

| Fase | Status | Progresso | Documentação |
|------|--------|-----------|--------------|
| **Fase 0** | ✅ Concluída | 100% | [fase-0-refatoracao-localstorage.md](./fase-0-refatoracao-localstorage.md) |
| **Fase 1** | 🔲 Pendente | 0% | - |
| **Fase 2** | 🔲 Pendente | 0% | - |
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

## 📋 Detalhamento das Fases

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

### 🔲 Fase 1: Infraestrutura Supabase

**Status:** 🔲 Pendente  
**Dependências:** Fase 0 ✅  
**Estimativa:** 2-3 horas

#### Objetivos
Configurar projeto Supabase, instalar dependências, modelar banco de dados e configurar autenticação passwordless.

#### Tasks

##### 1.1 Configurar Projeto e Dependências
- [ ] Criar conta no [Supabase](https://supabase.com)
- [ ] Criar novo projeto (região: South America ou US East)
- [ ] Instalar pacotes:
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  ```
- [ ] Criar arquivo `.env.local`:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
  ```
- [ ] Criar `src/lib/supabase/client.ts` - singleton do cliente Supabase

##### 1.2 Modelar Schema do Banco

**SQL para executar no Supabase Dashboard → SQL Editor:**

```sql
-- Tabela de perfis de usuários
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela genérica de dados do usuário (JSONB)
CREATE TABLE user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  data_key TEXT NOT NULL,
  data_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data_key)
);

-- Índices para performance
CREATE INDEX idx_user_data_user_id ON user_data(user_id);
CREATE INDEX idx_user_data_key ON user_data(data_key);
CREATE INDEX idx_user_data_updated_at ON user_data(updated_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuário só acessa seus próprios dados
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own data"
  ON user_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON user_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON user_data FOR DELETE
  USING (auth.uid() = user_id);
```

Tasks:
- [ ] Executar SQL acima no Supabase Dashboard
- [ ] Verificar tabelas criadas em "Table Editor"
- [ ] Criar `src/lib/supabase/types.ts` com tipos do schema

##### 1.3 Configurar Autenticação

No **Supabase Dashboard → Authentication → Providers:**
- [ ] Habilitar apenas "Email" (desabilitar password, só magic link)
- [ ] Configurar **Email Templates** (opcional - personalizar emails)
- [ ] Configurar **URL Configuration:**
  - Site URL: `http://localhost:3000` (dev) e `https://seu-dominio.com` (prod)
  - Redirect URLs: adicionar URLs permitidas

**Tasks:**
- [ ] Testar envio de magic link manualmente (Auth → Users → Invite User)
- [ ] Verificar email recebido e link funcionando

#### Arquivos a Criar
- `src/lib/supabase/client.ts`
- `src/lib/supabase/types.ts`
- `.env.local`

#### Verificação
- [ ] Cliente Supabase conecta sem erros
- [ ] Tabelas criadas e RLS ativo
- [ ] Magic link funciona (teste manual)

---

### 🔲 Fase 2: Sistema de Autenticação

**Status:** 🔲 Pendente  
**Dependências:** Fase 1 ✅  
**Estimativa:** 3-4 horas  
**Pode ser paralelo com:** Fase 1.2-1.3

#### Objetivos
Implementar módulo de autenticação, UI no sidebar (login/logout), e indicador de status de sincronização.

#### Tasks

##### 2.1 Criar Módulo de Autenticação

- [ ] Criar `src/modules/auth/use-auth.tsx` - Zustand store:
  - Estado: `user`, `session`, `loading`
  - Função `signInWithMagicLink(email)` → chama Supabase Auth
  - Função `signOut()` → logout
  - Listener `onAuthStateChange` → detecta mudanças de sessão
- [ ] Criar `AuthProvider` e adicionar no `layout.tsx`

##### 2.2 UI de Autenticação no Sidebar

Seguir padrão de [theme-selector.tsx](../src/modules/config/ui/theme-selector.tsx)

- [ ] Criar `src/modules/config/ui/auth-menu.tsx`:
  - **Deslogado:** Botão "Entrar" com ícone de usuário
  - **Logado:** Avatar/email + dropdown (perfil, sair)
  - Usar `DropdownMenu` do shadcn/ui
- [ ] Criar `src/modules/config/ui/auth-login-dialog.tsx`:
  - Modal com input de email
  - Botão "Enviar Link Mágico"
  - Estados: idle, enviando, sucesso, erro
- [ ] Adicionar `<Config.AuthMenu />` no `SidebarFooter` de [app-sidebar.tsx](../src/modules/manager/ui/app-sidebar.tsx)
- [ ] Toast de confirmação: "Email enviado! Verifique sua caixa de entrada"

##### 2.3 Indicador de Status de Sincronização

- [ ] Criar `src/modules/config/ui/sync-status-button.tsx`:
  - Botão com ícone de nuvem
  - Estados visuais:
    - ✅ **Sincronizado** - check verde
    - 🔄 **Sincronizando** - spinner animado
    - ⏳ **Pendente** - relógio amarelo
    - ❌ **Erro** - X vermelho
    - 📡 **Offline** - nuvem barrada
  - Tooltip: "Última sync: há 2 minutos | 3 mudanças pendentes"
  - Clicável: força sync manual
  - Progress bar sutil durante sync longa
- [ ] Adicionar no `SidebarFooter` ao lado do `AuthMenu`

#### Arquivos a Criar
- `src/modules/auth/use-auth.tsx`
- `src/modules/config/ui/auth-menu.tsx`
- `src/modules/config/ui/auth-login-dialog.tsx`
- `src/modules/config/ui/sync-status-button.tsx`

#### Arquivos a Modificar
- `src/modules/manager/ui/app-sidebar.tsx` - adicionar auth menu + sync button
- `src/app/layout.tsx` - adicionar AuthProvider

#### Verificação
- [ ] Botão "Entrar" aparece no sidebar
- [ ] Modal de login abre e envia email
- [ ] Email recebido e link funciona
- [ ] Após login, avatar/email aparecem
- [ ] Logout funciona
- [ ] Sessão persiste após refresh
- [ ] Status button aparece (pode ficar em "offline" por enquanto)

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
  
  // Sync completa (todas as chaves)
  async function fullSync(): Promise<void>
  
  // Adicionar à fila quando offline
  function queueChange(key: string, data: any): void
  
  // Processar fila pendente
  async function processSyncQueue(): Promise<void>
  ```
  
  **Lógica:**
  - Verificar se está online (`navigator.onLine`)
  - Verificar se está autenticado (`use-auth`)
  - Resolver conflitos via timestamps
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

- [ ] **Conflitos:**
  - Editar mesma ficha em 2 dispositivos offline
  - Voltar online → última edição vence

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
  NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
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

**Última atualização:** Fase 0 concluída em 02/05/2026  
**Próximo passo:** Iniciar Fase 1 - Infraestrutura Supabase
