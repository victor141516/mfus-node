import { pogo } from '../deps.ts'
import { PORT } from '../services/config.ts'
import { router as shortRouter } from './api/short/index.ts'

export const server = pogo.server({ port: PORT })
export const router = server.route(shortRouter, { path: '/api/short' })
