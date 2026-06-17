import https from 'https'

const PAT = process.env.SUPABASE_PAT
const PROJECT_REF = 'dlnlcqntbfgxowkywncz'

function mgmtApi(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query })
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAT}`,
        'Content-Type': 'application/json',
      },
    }
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch {
          resolve(body)
        }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

const tables = await mgmtApi(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
)
console.log('Tabelas:', tables.map((r) => r.table_name).join(', '))

const columns = await mgmtApi(
  "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'notes' ORDER BY ordinal_position"
)
console.log('\nColunas da tabela notes:')
columns.forEach((c) => console.log(`  ${c.column_name} (${c.data_type}) ${c.is_nullable === 'NO' ? 'NOT NULL' : ''}`))

const triggers = await mgmtApi(
  "SELECT trigger_name, event_manipulation FROM information_schema.triggers WHERE event_object_table = 'notes'"
)
console.log('\nTriggers:', triggers.map((t) => t.trigger_name).join(', ') || '(nenhum)')

const policies = await mgmtApi(
  "SELECT policyname, permissive, cmd FROM pg_policies WHERE tablename = 'notes'"
)
console.log('\nPolicies:', policies.map((p) => `${p.policyname} (${p.cmd})`).join(', ') || '(nenhuma)')

console.log('\n✅ Schema verificado com sucesso!')
