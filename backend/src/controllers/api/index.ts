import { Router } from 'express'
import { router as postRouter } from './short/index'

const router = Router()
router.use('/short', postRouter)
export { router }
