import { useState } from 'react'
import { useCopiedNotification } from './components/CopiedNotifcation'
import Input from './components/Input'
import SubmitButton from './components/SubmitButton'
import { getGuess, postShorten } from './services/backend'
import { BACKEND_BASE_URL, URL_ORIGIN } from './services/config'

// Redirect to the shorted URL in development
;(() => {
  const pathName = window.location.pathname
  if (pathName !== '/') {
    window.location.href = `${BACKEND_BASE_URL}${pathName}`
  }
})()

export default function App() {
  const [guess, setGuess] = useState<null | string>(null)
  const [code, setCode] = useState('')

  const fetchGuess = () => {
    getGuess().then((guess) => {
      if (guess) {
        setGuess(guess)
        setCode(guess)
      } else alert('Failed to get guess')
    })
  }

  if (!guess) {
    fetchGuess()
  }

  const [longUrl, setLongUrl] = useState('')
  const [CopiedNotification, onShowCopiedNotification] = useCopiedNotification()
  const UrlInput = Input({
    name: 'url',
    value: '',
    autofocus: true,
    label: 'Long URL',
    onChange: (val) => setLongUrl(val),
  })
  const CodeInput = Input({
    name: 'code',
    value: code,
    label: 'Short URL',
    prefix: 'mfus.tk/',
    onChange: (val) => setCode(val),
  })

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload: { url: string; code?: string } = { url: longUrl }
    if (code !== guess) payload.code = code
    const result = await postShorten(payload)
    if (result.ok) {
      setCode(result.code)
      await navigator.clipboard.writeText(`${URL_ORIGIN}/${result.code}`)
      onShowCopiedNotification()
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="flex flex-col items-center pt-4 h-screen dark:bg-slate-800">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
        mfus.tk
      </h1>
      <form className="mt-8 flex flex-col px-1 2xl:w-1/6" onSubmit={submitHandler}>
        <div className="my-2">{UrlInput}</div>
        <div className="my-2">{CodeInput}</div>
        <div className="mt-4 flex flex-col items-center">
          <div className="z-10">
            <SubmitButton>Short!</SubmitButton>
          </div>
          <div className="z-0">
            <CopiedNotification></CopiedNotification>
          </div>
        </div>
      </form>
    </div>
  )
}
