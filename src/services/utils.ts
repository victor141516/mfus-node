import { readAll, Request } from '../deps.ts'

export const bodyText = async (r: Request) => new TextDecoder().decode(await readAll(r.body))
export const bodyJson = async (r: Request) => JSON.parse(await bodyText(r))
