import { readFileSync } from 'fs'
import { Client } from 'pg'

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

async function main() {
  await client.connect()
  console.log('Conectado ao PostgreSQL Supabase')

  const sql = readFileSync('backend/schema.sql', 'utf8')
  await client.query(sql)
  console.log('Schema aplicado com sucesso!')

  const { rows } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
  )
  console.log('Tabelas:', rows.map((r) => r.table_name).join(', '))

  await client.end()
}

main().catch((err) => {
  console.error('Erro:', err.message)
  process.exit(1)
})
