# API — Winote

> API REST auto-gerada pelo Supabase a partir do schema PostgreSQL.
> Documentação mantida manualmente — atualizar sempre que o schema mudar.

---

## Stack

| Camada    | Tecnologia                  |
| --------- | --------------------------- |
| Banco     | PostgreSQL 15+ (Supabase)   |
| API       | Supabase REST (PostgREST)   |
| Cliente   | `@supabase/supabase-js`     |
| Autenticação | Supabase Auth (futuro)   |

---

## Schema do Banco

### `notes`

| Coluna         | Tipo         | Descrição                       | Constraints          |
| -------------- | ------------ | ------------------------------- | -------------------- |
| `id`           | `uuid`       | Identificador único             | PK, `gen_random_uuid()` |
| `title`        | `text`       | Título da nota                  | `NOT NULL DEFAULT ''` |
| `content`      | `text`       | Conteúdo da nota                | `NOT NULL DEFAULT ''` |
| `created_at`   | `timestamptz`| Data de criação                 | `NOT NULL DEFAULT NOW()` |
| `updated_at`   | `timestamptz`| Data da última atualização      | `NOT NULL DEFAULT NOW()`, auto via trigger |
| `last_opened_at`| `timestamptz`| Data da última abertura        | nullable             |

**Índices:**

- `idx_notes_updated_at` — `updated_at DESC`
- `idx_notes_last_opened_at` — `last_opened_at DESC NULLS LAST`

**Trigger:**

- `trg_notes_updated_at` — atualiza `updated_at` automaticamente antes de cada `UPDATE`.

---

## Endpoints REST

Base URL: `https://[PROJECT_REF].supabase.co/rest/v1`

Headers obrigatórios:

```
apikey: <EXPO_PUBLIC_SUPABASE_ANON_KEY>
Authorization: Bearer <EXPO_PUBLIC_SUPABASE_ANON_KEY>
Content-Type: application/json
Prefer: return=representation
```

### `GET /notes` — Listar notas

```http
GET /rest/v1/notes?order=updated_at.desc
```

Query params opcionais:

| Parâmetro | Exemplo                  | Descrição                |
| --------- | ------------------------ | ------------------------ |
| `order`   | `updated_at.desc`        | Ordenação                |
| `limit`   | `10`                     | Limite de registros      |
| `offset`  | `0`                      | Paginação                |
| `select`  | `id,title`               | Campos retornados        |

**Exemplo `curl`:**

```bash
curl -X GET "https://[PROJECT_REF].supabase.co/rest/v1/notes?order=updated_at.desc" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"
```

### `GET /notes?id=eq.{id}` — Buscar por ID

```http
GET /rest/v1/notes?id=eq.550e8400-e29b-41d4-a716-446655440000
```

### `POST /notes` — Criar nota

```http
POST /rest/v1/notes
Content-Type: application/json

{
  "title": "Minha nota",
  "content": "Conteúdo da nota"
}
```

### `PATCH /notes?id=eq.{id}` — Atualizar nota

```http
PATCH /rest/v1/notes?id=eq.550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "title": "Novo título",
  "content": "Novo conteúdo"
}
```

### `DELETE /notes?id=eq.{id}` — Deletar nota

```http
DELETE /rest/v1/notes?id=eq.550e8400-e29b-41d4-a716-446655440000
```

---

## Row Level Security (RLS)

Atualmente configurado com acesso **público** (todas as operações permitidas sem autenticação).

| Policy              | Operação | Acesso atual |
| ------------------- | -------- | ------------ |
| `notes_select_all`  | SELECT   | `true`       |
| `notes_insert_all`  | INSERT   | `true`       |
| `notes_update_all`  | UPDATE   | `true`       |
| `notes_delete_all`  | DELETE   | `true`       |

> ⚠️ **Para produção:** substituir `USING (true)` por `USING (auth.uid() IS NOT NULL)` e associar notas a usuários.

---

## Como usar no frontend

### Instalação

```bash
npx expo install @supabase/supabase-js
```

### Configuração

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Exemplo de uso

```ts
// Listar notas
const notes = await supabase
  .from('notes')
  .select('*')
  .order('updated_at', { ascending: false })

// Criar
await supabase.from('notes').insert({ title: 'Nova nota', content: '...' })

// Atualizar
await supabase
  .from('notes')
  .update({ title: 'Atualizado' })
  .eq('id', noteId)

// Deletar
await supabase.from('notes').delete().eq('id', noteId)
```
