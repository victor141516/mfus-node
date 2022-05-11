import { assert, expect } from 'chai'
import supertest from 'supertest'
import Sinon from 'sinon'
import * as database from '../src/services/database'
import pg, { Client } from 'pg'
import { it } from 'mocha'

// const mockedDbFactory = <T>(result: T[]) =>
//   new (class MockedDb {
//     isConnected: boolean

//     constructor() {
//       this.isConnected = false
//     }

//     query(q: string) {
//       return Promise.resolve({ rows: result, isMock: true })
//     }

//     async connect() {
//       this.isConnected = true
//     }
//   })() as unknown as Client

// const mockDb = <T>(result: T[]) => {
//   const promisedDb = mockedDbFactory<T>(result)
//   return Sinon.stub(pg, 'Client').returns(promisedDb)
// }

describe('HTTP tests', function () {
  const stubs: Sinon.SinonStub[] = []

  const mockDbQueries = (results: unknown[][]) => {
    const queryStub = Sinon.stub(pg.Client.prototype, 'query')
    stubs.push(queryStub)
    results.forEach((_, i) => {
      queryStub.onCall(i).resolves({ rows: results[i] })
    })
    return queryStub
  }

  before(() => {
    stubs.push(Sinon.stub(pg.Client.prototype, 'connect').resolves())
  })

  afterEach(() => {
    stubs.forEach((stub) => stub.restore())
  })

  describe('Guess', function () {
    it('Non-initial guess', async function () {
      mockDbQueries([[{ id: 10, url: 'http://example.com' }]])
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server
        .get('/api/short/guess')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(({ body }) => {
          assert.isTrue(body.ok)
          assert.strictEqual(body.code, 'l')
        })
    })

    it('Initial guess', async function () {
      mockDbQueries([[]])
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server
        .get('/api/short/guess')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(({ body }) => {
          assert.isTrue(body.ok)
          assert.strictEqual(body.code, 'b')
        })
    })
  })

  describe('Go to short URL', function () {
    it('Existing URL', async function () {
      mockDbQueries([[{ url: 'http://example.com' }]])
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server.get('/l').expect(302).expect('Location', 'http://example.com')
    })

    it('Missing URL', async function () {
      mockDbQueries([[]])
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server.get('/l').expect(302).expect('Location', '/')
    })
  })

  describe('New short URL', function () {
    it('Short-codes a URL successfully', async function () {
      const { args: queryArgs } = mockDbQueries([[{ id: 11 }], [{ id: -1 }]])
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server
        .post('/api/short')
        .send({ url: 'http://example.com' })
        .expect(200)
        .expect(({ body }) => {
          assert.isTrue(body.ok)
          assert.strictEqual(body.code, 'l')
          assert.isTrue(queryArgs[0][0].startsWith('INSERT INTO short_code_links'))
          assert.strictEqual(queryArgs[0][1][0], 'http://example.com')
        })
    })

    it('Long-codes a URL successfully', async function () {
      const { args: queryArgs } = mockDbQueries([[{ id: 11, code: 'long-code' }], [{ id: -1 }]])
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server
        .post('/api/short')
        .send({ url: 'http://example.com', code: 'long-code' })
        .expect(200)
        .expect(({ body }) => {
          assert.isTrue(body.ok)
          assert.strictEqual(body.code, 'long-code')
          assert.isTrue(queryArgs[0][0].startsWith('INSERT INTO long_code_links'))
          assert.strictEqual(queryArgs[0][1][0], 'http://example.com')
          assert.strictEqual(queryArgs[0][1][1], 'long-code')
        })
    })

    it('Long-codes a URL and fails due to duplication', async function () {
      const queryStub = mockDbQueries([[]])
      queryStub.onCall(0).rejects({ code: 23505 })
      const queryArgs = queryStub.args
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server
        .post('/api/short')
        .send({ url: 'http://example.com', code: 'long-code' })
        .expect(400)
        .expect(({ body }) => {
          assert.isFalse(body.ok)
          assert.strictEqual(body.error, 'DUPLICATE_KEY')
          assert.isTrue(queryArgs[0][0].startsWith('INSERT INTO long_code_links'))
          assert.strictEqual(queryArgs[0][1][0], 'http://example.com')
          assert.strictEqual(queryArgs[0][1][1], 'long-code')
        })
    })

    it('Long-codes a URL and fails due to missing URL to short', async function () {
      const { args: queryArgs } = mockDbQueries([[]])
      const { getExpressApp } = await import('../src/controllers')
      const server = supertest(getExpressApp())
      return server
        .post('/api/short')
        .send({ code: 'long-code' })
        .expect(400)
        .expect(({ body }) => {
          assert.isFalse(body.ok)
          assert.strictEqual(body.error, 'MISSING_URL')
          assert.lengthOf(queryArgs, 0)
        })
    })
  })
})
