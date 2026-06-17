-- =============================================================================
-- Winote — Database Schema
-- =============================================================================
-- Tecnologia: PostgreSQL 15+ (Supabase)
--
-- Este arquivo é a fonte da verdade para o schema do banco.
-- Para aplicar: execute no SQL Editor do Supabase Dashboard.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABELAS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_opened_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- 2. ÍNDICES
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_last_opened_at ON notes (last_opened_at DESC NULLS LAST);

-- ---------------------------------------------------------------------------
-- 3. TRIGGER — updated_at automático
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notes_updated_at ON notes;
CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------------
-- ATENÇÃO: Ajuste as políticas conforme necessidade de autenticação.
-- Por enquanto: acesso público (leitura/escrita para todos).
-- Quando implementar auth, trocar USING(true) por USING(auth.uid() IS NOT NULL).

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode ler
CREATE POLICY "notes_select_all"
  ON notes
  FOR SELECT
  USING (true);

-- Política: qualquer um pode inserir
CREATE POLICY "notes_insert_all"
  ON notes
  FOR INSERT
  WITH CHECK (true);

-- Política: qualquer um pode atualizar
CREATE POLICY "notes_update_all"
  ON notes
  FOR UPDATE
  USING (true);

-- Política: qualquer um pode deletar
CREATE POLICY "notes_delete_all"
  ON notes
  FOR DELETE
  USING (true);
