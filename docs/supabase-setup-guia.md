# Guia de Setup do Supabase - Fase 1

Este guia fornece instruções passo a passo para configurar o projeto Supabase para o Castles App.

## 📋 Pré-requisitos

- [ ] Conta no [Supabase](https://supabase.com) (gratuita)
- [ ] Dependências instaladas (`npm install` já executado)

## 🚀 Passos de Configuração

### 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta gratuita
3. Clique em **"New Project"**
4. Preencha os dados:
   - **Name:** `castles-app` (ou nome de sua preferência)
   - **Database Password:** Crie uma senha forte (será necessária apenas para conexões diretas ao PostgreSQL)
   - **Region:** Escolha `South America (São Paulo)` para melhor latência no Brasil, ou `US East` como alternativa
   - **Pricing Plan:** Free (500 MB storage, 2 GB bandwidth/mês)
5. Clique em **"Create new project"**
6. Aguarde 2-3 minutos enquanto o projeto é provisionado

### 2. Obter Credenciais da API

1. No dashboard do seu projeto, vá em **Settings** (⚙️) no menu lateral
2. Clique em **API**
3. Copie as seguintes informações:
   - **Project URL:** `https://xxx.supabase.co`
   - **anon public:** Esta é sua `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### 3. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores de placeholder pelas suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Importante:** Reinicie o servidor de desenvolvimento após editar `.env.local`:
   ```bash
   # Pare o servidor (Ctrl+C) e reinicie:
   npm run dev
   ```

### 4. Criar Schema do Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor** (ícone de banco de dados) no menu lateral
2. Clique em **"New query"**
3. Abra o arquivo `docs/supabase-schema.sql` deste repositório
4. Copie **todo o conteúdo** do arquivo SQL
5. Cole no editor SQL do Supabase
6. Clique em **"Run"** (ou pressione Ctrl/Cmd + Enter)
7. Aguarde a confirmação: `Success. No rows returned`

### 5. Verificar Tabelas Criadas

1. No menu lateral, vá em **Table Editor**
2. Você deve ver as seguintes tabelas:
   - ✅ `user_profiles`
   - ✅ `user_data`
3. Clique em cada tabela para ver a estrutura de colunas

### 6. Configurar Autenticação

#### 6.1 Habilitar Email Magic Link

1. No menu lateral, vá em **Authentication** → **Providers**
2. Localize **Email** na lista de provedores
3. Certifique-se de que está **habilitado** (toggle verde)
4. **Importante:** Desabilite a opção "Confirm email" para desenvolvimento local:
   - Role para baixo até encontrar "Email Settings"
   - Desabilite "Confirm email" (para ambiente de desenvolvimento)
   - Em produção, habilite novamente para segurança

#### 6.2 Configurar URLs de Redirecionamento

1. Vá em **Authentication** → **URL Configuration**
2. Configure as seguintes URLs:

**Para Desenvolvimento:**
```
Site URL: http://localhost:3000
Redirect URLs: 
  - http://localhost:3000
  - http://localhost:3000/auth/callback
```

**Para Produção (adicionar quando fizer deploy):**
```
Site URL: https://seu-dominio.com
Redirect URLs: 
  - https://seu-dominio.com
  - https://seu-dominio.com/auth/callback
```

3. Clique em **"Save"**

#### 6.3 Configurar Templates de Email (Opcional)

1. Vá em **Authentication** → **Email Templates**
2. Você pode personalizar os templates:
   - **Magic Link:** Email enviado para login sem senha
   - **Confirm Signup:** Email de confirmação de cadastro
   - **Reset Password:** Email de recuperação de senha

Para desenvolvimento, os templates padrão funcionam bem.

### 7. Testar Autenticação

1. No menu lateral, vá em **Authentication** → **Users**
2. Clique em **"Invite user"**
3. Digite um email de teste (pode ser seu email pessoal)
4. Clique em **"Send invitation"**
5. Verifique seu email
6. Você deve receber um "Magic Link" do Supabase
7. **Não clique no link ainda** - ele será usado quando testarmos a UI

### 8. Verificar Row Level Security (RLS)

1. No menu lateral, vá em **Authentication** → **Policies**
2. Selecione a tabela `user_profiles`
3. Você deve ver as políticas:
   - ✅ `Users can view own profile`
   - ✅ `Users can update own profile`
4. Selecione a tabela `user_data`
5. Você deve ver as políticas:
   - ✅ `Users can view own data`
   - ✅ `Users can insert own data`
   - ✅ `Users can update own data`
   - ✅ `Users can delete own data`

## ✅ Verificação Final

Antes de prosseguir para a Fase 2, confirme:

- [x] Projeto Supabase criado
- [x] Credenciais copiadas para `.env.local`
- [x] Servidor de desenvolvimento reiniciado
- [x] Schema SQL executado com sucesso
- [x] Tabelas `user_profiles` e `user_data` visíveis no Table Editor
- [x] RLS habilitado e políticas criadas
- [x] Autenticação por Email configurada
- [x] URLs de redirecionamento configuradas
- [x] Teste de Magic Link enviado com sucesso

## 🐛 Problemas Comuns

### Erro: "Invalid API key"
**Causa:** Credenciais incorretas em `.env.local`
**Solução:**
1. Verifique se copiou a **anon public** key (também chamada de publishable key, não a service_role key)
2. Confirme que as variáveis começam com `NEXT_PUBLIC_`
3. Reinicie o servidor de desenvolvimento

### Erro: "Failed to execute SQL"
**Causa:** Script SQL com erro de sintaxe ou executado parcialmente
**Solução:**
1. Delete as tabelas criadas manualmente no Table Editor
2. Execute o script completo novamente
3. Verifique se não há erros de permissão

### Magic Link não chega
**Causa:** Configuração de email ou spam
**Solução:**
1. Verifique a pasta de spam
2. Em **Authentication** → **Providers** → **Email**, verifique se o provedor está habilitado
3. Para desenvolvimento, use o Supabase Inbucket (se disponível)

### Erro: "relation 'user_profiles' does not exist"
**Causa:** Tabelas não foram criadas
**Solução:**
1. Execute o script SQL do passo 4 novamente
2. Verifique se há erros no SQL Editor

## 📚 Próximos Passos

Após completar este setup:
1. ✅ Fase 1 concluída
2. ⏭️ Prosseguir para **Fase 2: Sistema de Autenticação**

## 🔗 Links Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Última atualização:** Fase 1 - 02/05/2026
