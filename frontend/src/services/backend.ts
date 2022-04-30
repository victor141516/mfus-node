import { BACKEND_BASE_URL } from './config'

export const postShorten = async ({ url, code }: { url: string; code?: string }) => {
  return (await fetch(`${BACKEND_BASE_URL}/api/short`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, code }),
  }).then((r) => r.json())) as { ok: true; code: string } | { ok: false; error?: string }
}

export const getGuess = async () => {
  const { ok, code } = (await fetch(`${BACKEND_BASE_URL}/api/short/guess`).then((r) => r.json())) as {
    ok: boolean
    code?: string
  }
  if (ok) {
    return code!
  } else {
    return null
  }
}
