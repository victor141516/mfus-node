import { Client } from 'pg'
import { decode } from './coder'
import { LinkType, LongCodeLink, ShortCodeLink } from './database'

async function saveShortCodeLink(db: Client, { url }: { url: string }) {
  const { rows } = await db.query<ShortCodeLink>(`INSERT INTO short_code_links (url) VALUES ($1) RETURNING *`, [url])
  return rows[0]
}

async function saveLongCodeLink(db: Client, { url, code }: { url: string; code: string }) {
  const { rows } = await db.query<LongCodeLink>(`INSERT INTO long_code_links (url, code) VALUES ($1, $2) RETURNING *`, [
    url,
    code,
  ])
  return rows[0]
}

async function saveType(db: Client, { code, isLong, refId }: { code: string; isLong: boolean; refId: number }) {
  const { rows } = await db.query<LinkType>(
    `INSERT INTO link_types (code, is_long, short_code_id, long_code_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [code, isLong, isLong ? null : refId, isLong ? refId : null],
  )
  return rows[0]
}

export async function saveLink(db: Client, { url, code }: { url: string; code?: string }) {
  let isLong: boolean
  let result: ShortCodeLink | LongCodeLink
  if (code) {
    isLong = true
    result = await saveLongCodeLink(db, { url, code })
  } else {
    isLong = false
    result = await saveShortCodeLink(db, { url })
  }
  await saveType(db, {
    code: code ?? decode(result.id),
    isLong,
    refId: result.id,
  })
  return result
}

export async function getLink(db: Client, code: string) {
  const { rows } = await db.query<{ url: string }>(
    `SELECT
			COALESCE(long_code_links.url, short_code_links.url) AS url
		FROM
			link_types
			FULL JOIN long_code_links ON long_code_id = long_code_links.id
			FULL JOIN short_code_links ON short_code_id = short_code_links.id
		WHERE
			link_types.code = $1;`,
    [code],
  )
  if (rows.length === 0) {
    console.warn('Link not found:', code)
    return null
  } else {
    return rows[0].url
  }
}
