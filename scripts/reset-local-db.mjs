import pg from 'pg'

const { Client } = pg

// Connect to the postgres system database (not ic_yec) so we can drop it
const client = new Client({
  connectionString: 'postgresql://payload:payload_dev@127.0.0.1:5433/postgres',
})

await client.connect()

console.log('Dropping database ic_yec…')
await client.query('DROP DATABASE IF EXISTS ic_yec')

console.log('Creating database ic_yec…')
await client.query('CREATE DATABASE ic_yec')

await client.end()
console.log('✅ Done. Now run: pnpm payload migrate')
