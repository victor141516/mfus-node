import cors from 'cors'
import { Router, Request, Response } from 'express'
import { Client, DatabaseError } from 'pg'
import { getFreshShortCode } from '../../../services/last-short-link'
import { decode } from '../../../services/coder'
import { db, LongCodeLink, stringifyError } from '../../../services/database'
import { saveLink } from '../../../services/links'

export const handleSaveLinkAction = async (db: Client, { url, code }: { url: string; code?: string }) => {
  return (await saveLink(await db, { url, code })
    .then((result) => {
      const code = (result as LongCodeLink)!.code ?? decode(result.id)
      return { ok: true, code }
    })
    .catch((err: DatabaseError) => {
      console.error({ err })
      return {
        ok: false,
        error: stringifyError(err.code ?? ''),
      }
    })) as
    | {
        ok: true
        code: string
      }
    | { ok: false; error: string }
}

const post = async (req: Request, res: Response) => {
  const body = req.body
  console.log({ body })

  if (!body.url) {
    return res.status(400).send({ ok: false, error: 'MISSING_URL' })
  }

  const result = await handleSaveLinkAction(await db, body)
  return res.status(result.ok ? 200 : 400).send(result)
}

const guess = async (req: Request, res: Response) => {
  const intCode = await getFreshShortCode(await db)
  const code = decode(intCode)
  const payload = { ok: true, code }
  return res.status(200).send(payload)
}

const router = Router()
router.use(cors())
// router.options('/', (_, res) => res.status(200).end())
router.post('/', post)
router.get('/guess', guess)
export { router }
