import { Client } from 'pg'
import { ShortCodeLink } from './database'

export async function getFreshShortCode(db: Client): Promise<number> {
  const { rows } = await db.query<ShortCodeLink>(`SELECT id from short_code_links ORDER BY id DESC LIMIT 1`)
  let lastUsedId = 0
  if (rows.length !== 0) lastUsedId = rows[0].id
  return lastUsedId + 1
}
