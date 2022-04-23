import { pogo, RouteHandler } from '../../../deps.ts'
import { Link } from '../../../models/link.ts'
import { db } from '../../../services/database.ts'
import { getFirstAvailableLink, updateLastFirstAvailableLinkId } from '../../../services/last-link.ts'
import { bodyJson } from '../../../services/utils.ts'

const post: RouteHandler = async (req, h) => {
  const body = await bodyJson(req)

  if (!body.url) {
    const response = h.response().code(400)
    response.body = { ok: false, error: 'Missing code or url' }
    return response
  }

  let link: Link
  if (body.code) {
    link = new Link(await db, {
      url: body.url,
      code: body.code ?? 10,
    })
  } else {
    link = await getFirstAvailableLink(await db)
    updateLastFirstAvailableLinkId(link.id!)
    link.url = body.url
  }
  await link.save().catch(console.error)
  return { ok: true, code: link.code }
}

export const router = pogo.router().post('/', post)
