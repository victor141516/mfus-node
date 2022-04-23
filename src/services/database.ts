import { PostgresClient } from '../deps.ts'
import { Link } from '../models/link.ts'
import * as CONFIG from './config.ts'

async function init() {
  const client = new PostgresClient({
    hostname: CONFIG.DATABASE_HOST,
    port: CONFIG.DATABASE_PORT,
    user: CONFIG.DATABASE_USER,
    password: CONFIG.DATABASE_PASSWORD,
    database: CONFIG.DATABASE_DBNAME,
  })
  await client.connect()
  return client
}

export const db = init()
