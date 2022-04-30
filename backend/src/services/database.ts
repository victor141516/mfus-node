import { Client } from 'pg'
import * as CONFIG from './config'

interface TsModel {
  id: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface ShortCodeLink extends TsModel {
  url: string
}

export interface LongCodeLink extends TsModel {
  url: string
  code: string
}

export interface LinkType extends TsModel {
  code: string
  is_long: boolean
  long_code_id?: number
  short_code_id?: number
}

export const ERRORS = { DUPLICATE_KEY: 'DUPLICATE_KEY', UNKNOWN: 'UNKNOWN' }
export const stringifyError = (errCode: string): typeof ERRORS[keyof typeof ERRORS] =>
  ({ '23505': ERRORS.DUPLICATE_KEY }[errCode] ?? ERRORS.UNKNOWN)

async function init() {
  const client = new Client({
    host: CONFIG.DATABASE_HOST,
    port: CONFIG.DATABASE_PORT,
    user: CONFIG.DATABASE_USER,
    password: CONFIG.DATABASE_PASSWORD,
    database: CONFIG.DATABASE_DBNAME,
  })
  await client.connect()
  return client
}

export const db = init()
