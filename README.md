# Castles App

Aplicação Next.js para utilitários de Castles & Crusades com suporte a sincronização de dados localStorage ↔ Supabase (offline-first).
## Requisitos

- Node.js 20+
- npm 10+

## Setup Local

1. Instale dependências:

```bash
npm install
```

2. Configure variáveis de ambiente:

```bash
cp .env.example .env.local
```

3. Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no `.env.local`.

4. Rode em desenvolvimento:

```bash
npm run dev
```

## Variáveis de Ambiente

Arquivo de referência: `.env.example`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

## Setup do Supabase

1. Crie um projeto no Supabase Dashboard.
2. Rode o SQL em `docs/supabase-schema.sql` no SQL Editor.
3. Em Authentication:

- Habilite login por email (magic link)
- Configure `Site URL` e `Redirect URLs`
4. Copie URL e publishable key para o `.env.local`.

## Fluxo de Sincronização

- Dados são salvos localmente primeiro (offline-first).
- Quando online e autenticado, mudanças sobem para o Supabase.
- Quando offline, operações entram na fila (`sync-queue`).

- Ao reconectar, fila é processada automaticamente.
- Conflitos usam `last-write-wins` por timestamp.

Arquivos principais:

- `src/lib/sync/sync-manager.ts`
- `src/lib/sync/sync-queue.ts`
- `src/lib/sync/synced-local-storage.ts`
- `src/hooks/use-sync-scheduler.tsx`
- `src/modules/auth/use-auth.tsx`

## Scripts

- `npm run dev` - ambiente local
- `npm run build` - build de produção
- `npm run start` - servidor produção local
- `npm run lint` - checagem com Biome
- `npm run format` - formatação com Biome

## Checklist de Validação (Fase 6)

- Login por magic link funciona
- Sessão persiste após refresh
- Offline: criar/editar/deletar dados continua funcionando
- Reconexão processa fila automaticamente
- Multi-dispositivo sincroniza via merge bidirecional
- Migração local → nuvem aparece no primeiro login quando aplicável

## Deploy (Vercel)

1. Conecte o repositório no Vercel.
2. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
3. Deploy.
4. Atualize no Supabase Authentication:

- `Site URL` para domínio de produção
- `Redirect URL` para `https://seu-dominio.com/auth/callback`

## Testes em Produção

- Magic link abre e autentica corretamente
- Sincronização manual e automática funcionando
- Performance de sync aceitável em conexões móveis
