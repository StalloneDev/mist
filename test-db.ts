import 'dotenv/config'
import { Pool } from 'pg'

async function test() {
    console.log('DATABASE_URL found:', !!process.env.DATABASE_URL)
    console.log('URL preview:', process.env.DATABASE_URL?.substring(0, 60) + '...')

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })

    try {
        const client = await pool.connect()
        const res = await client.query('SELECT NOW()')
        console.log('✅ Connection successful! Server time:', res.rows[0].now)
        client.release()
    } catch (err) {
        console.error('❌ Connection failed:', err)
    } finally {
        await pool.end()
    }
}

test()
