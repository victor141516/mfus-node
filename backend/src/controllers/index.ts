import express, { Express } from 'express'
import { PORT } from '../services/config'
import { router as apiRouter } from './api'
import { router as rootRouter } from './root'

export const getExpressApp = () => {
  const app = express()
  app.use(express.json())
  app.use('/api', apiRouter)
  app.use('/favicon.ico', (_, res) => res.status(404).end())
  app.use('/', rootRouter)
  return app
}

export const serve = () => {
  getExpressApp().listen(PORT, () => console.log(`Listening on port ${PORT}`))
}
