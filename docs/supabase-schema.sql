-- ============================================
-- Schema do Banco de Dados Castles App
-- ============================================
-- Execute este script no Supabase Dashboard → SQL Editor
-- para criar todas as tabelas, índices e políticas RLS

-- ============================================
-- 1. Tabela de Perfis de Usuários
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ,
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================
-- 2. Tabela de Dados do Usuário (JSONB)
-- ============================================
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  data_key TEXT NOT NULL,
  data_value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data_key)
);

-- ============================================
-- 2.1 Tabela de Compendium v2
-- ============================================
CREATE TABLE IF NOT EXISTS compendium_v2_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  thumbnail TEXT,
  data JSONB NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. Índices para Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_key ON user_data(data_key);
CREATE INDEX IF NOT EXISTS idx_user_data_updated_at ON user_data(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_compendium_v2_user_id ON compendium_v2_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_compendium_v2_category ON compendium_v2_entries(category);
CREATE INDEX IF NOT EXISTS idx_compendium_v2_tags ON compendium_v2_entries USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_compendium_v2_nome ON compendium_v2_entries(nome);
CREATE INDEX IF NOT EXISTS idx_compendium_v2_updated_at ON compendium_v2_entries(updated_at DESC);

-- ============================================
-- 4. Habilitar Row Level Security (RLS)
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE compendium_v2_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. Políticas RLS para user_profiles
-- ============================================
-- Usuários podem ver apenas seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 6. Políticas RLS para user_data
-- ============================================
-- Usuários podem ver apenas seus próprios dados
DROP POLICY IF EXISTS "Users can view own data" ON user_data;
CREATE POLICY "Users can view own data"
  ON user_data FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir apenas seus próprios dados
DROP POLICY IF EXISTS "Users can insert own data" ON user_data;
CREATE POLICY "Users can insert own data"
  ON user_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar apenas seus próprios dados
DROP POLICY IF EXISTS "Users can update own data" ON user_data;
CREATE POLICY "Users can update own data"
  ON user_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem deletar apenas seus próprios dados
DROP POLICY IF EXISTS "Users can delete own data" ON user_data;
CREATE POLICY "Users can delete own data"
  ON user_data FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6.1 Políticas RLS para compendium_v2_entries
-- ============================================
DROP POLICY IF EXISTS "Users can view own compendium v2" ON compendium_v2_entries;
CREATE POLICY "Users can view own compendium v2"
  ON compendium_v2_entries FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own compendium v2" ON compendium_v2_entries;
CREATE POLICY "Users can insert own compendium v2"
  ON compendium_v2_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own compendium v2" ON compendium_v2_entries;
CREATE POLICY "Users can update own compendium v2"
  ON compendium_v2_entries FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own compendium v2" ON compendium_v2_entries;
CREATE POLICY "Users can delete own compendium v2"
  ON compendium_v2_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. Função para criar perfil automaticamente
-- ============================================
-- Cria perfil de usuário automaticamente quando um novo usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Trigger para criar perfil automaticamente
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- Verificação: Execute as queries abaixo para confirmar que tudo foi criado corretamente
-- SELECT * FROM user_profiles;
-- SELECT * FROM user_data;
