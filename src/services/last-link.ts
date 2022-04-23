import { PostgresClient } from '../deps.ts'
import { DbLink, Link } from '../models/link.ts'

export async function getLastSequentialLink(db: PostgresClient): Promise<Link | null> {
  let link: Link

  const cachedId = localStorage.getItem('last-item-id')
  if (cachedId) {
    link = new Link(db, { id: parseInt(cachedId) })
    await link.fetch()
  } else {
    const { rows, rowCount } = await db.queryObject<DbLink>(
      'SELECT id FROM links WHERE code is null ORDER BY id DESC LIMIT 1;',
    )
    if (rowCount === 0) return null
    else {
      link = new Link(db, { id: rows[0].id })
    }
    localStorage.setItem('last-item-id', link.id!.toString())
  }

  return link
}

export async function isLinkAvailable(id: number, db: PostgresClient): Promise<boolean> {
  const { rowCount } = await db.queryObject<DbLink>('SELECT id FROM links WHERE id = $1;', [id])
  return rowCount === 0
}

let lastFirstAvailableLinkId: number
export async function getFirstAvailableLink(db: PostgresClient): Promise<Link> {
  let from = lastFirstAvailableLinkId

  if (!from) {
    const lastLink = await getLastSequentialLink(await db)
    from = lastLink!.id!
  }

  let ok = false
  while (!ok) {
    from++
    ok = await isLinkAvailable(from, await db)
  }

  return new Link(db, { id: from })
}

export function updateLastFirstAvailableLinkId(codeInt: number) {
  lastFirstAvailableLinkId = codeInt
}
