import express, { Router } from 'express'
import { readFileSync } from 'fs'
import { handleSaveLinkAction } from '../../controllers/api/short'
import { IS_PRODUCTON, LEGACY_API_SUPPORT } from '../../services/config'
import { db } from '../../services/database'
import { getLink } from '../../services/links'

const router = Router()

if (IS_PRODUCTON) {
  const indexFile = readFileSync('frontend/index.html').toString()
  router.use('/assets', express.static('frontend/assets'))
  router.get('/', (_, res) => res.status(200).send(indexFile))
}

if (LEGACY_API_SUPPORT) {
  router.post('/short', async (req, res) => {
    const { longUrl, shortCode } = req.body as { shortCode: string; longUrl: string }
    const result = await handleSaveLinkAction(await db, { url: longUrl, code: shortCode })

    let body: Record<string, string> = { result: 'CODE_ALREADY_EXISTS' }
    if (result.ok) {
      body = { result: 'OK', short: result.code }
    }

    return res.status(200).send(body)
  })
}

router.get('/:code', async (req, res) => {
  const code = req.params.code as string
  const url = await getLink(await db, code)
  return res.status(301).redirect(url ?? '/')
})

export { router }
