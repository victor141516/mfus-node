import { PostgresClient } from '../deps.ts'
import { decode, encode } from '../services/coder.ts'

export interface DbLink {
  id: number
  code: string
  url: string
  created_at: Date
  updated_at: Date
}

export class Link {
  db: PostgresClient
  id?: number
  code?: string // this only exists for custom codes (not sequential)
  url?: string
  createdAt?: Date
  updatedAt?: Date

  constructor(
    db: PostgresClient,
    {
      id,
      code,
      url,
      createdAt,
      updatedAt,
    }: {
      id?: number
      code?: string
      url?: string
      createdAt?: Date
      updatedAt?: Date
    },
  ) {
    this.db = db
    if (id) this.id = id
    if (code) this.code = code
    if (url) this.url = url
    if (createdAt) this.createdAt = createdAt
    if (updatedAt) this.updatedAt = updatedAt
  }

  get hasCustomCode(): boolean {
    return this.code !== null
  }

  get shortCode(): string {
    return decode(this.id!)
  }

  async fetch() {
    let query: string
    let params: [number | string]
    if (this.id) {
      query = 'SELECT * FROM links WHERE id = $1'
      params = [this.id]
    } else if (this.code) {
      query = 'SELECT * FROM links WHERE code = $1'
      params = [this.code]
    } else throw new Error('Missing id or code')

    const { rowCount, rows } = await this.db.queryObject<DbLink>(query, params)
    if (rowCount !== 1) throw new Error('Link not found')
    const { id, code, url, created_at, updated_at } = rows[0]
    this.id = id
    this.code = code
    this.url = url
    this.createdAt = created_at
    this.updatedAt = updated_at
  }

  // #translateToDb(): DbLink {
  //   return {
  //     id: this.id!,
  //     code: this.code!,
  //     code_int: this.codeInt!,
  //     url: this.url!,
  //     created_at: this.createdAt!,
  //     updated_at: this.updatedAt!,
  //   }
  // }

  async save() {
    let [query, params] = [
      `INSERT INTO links
    (url)
    VALUES ($1)
    ON CONFLICT (code)
      DO UPDATE SET url = $2, updated_at = NOW();`,
      [this.url!],
    ]

    if (this.code) {
      // deno-lint-ignore no-extra-semi
      ;[query, params] = [
        `INSERT INTO links
      (code, url)
      VALUES ($1, $2)
      ON CONFLICT (code)
        DO UPDATE SET url = $2, updated_at = NOW();`,
        [this.code!, this.url!],
      ]
    }

    if (this.id) {
      // deno-lint-ignore no-extra-semi
      ;[query, params] = [
        `UPDATE links SET ${this.code ? 'code = $3,' : ''} url = $2, updated_at = NOW() WHERE id = $1;`,
        [(this.id ?? 1).toString(), this.url!].concat(this.code ? [this.code!] : []),
      ]
    }
    await this.db.queryObject<DbLink>(query, params)
  }
}
