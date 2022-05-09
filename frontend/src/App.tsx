import { useEffect, useState } from 'react'
import { AlertGroup } from './components/AlertGroup'
import { useCopiedNotification } from './components/CopiedNotifcation'
import { Input } from './components/Input'
import { SubmitButton } from './components/SubmitButton'
import { AlertManager } from './services/alerts'
import { getGuess, postShorten } from './services/backend'
import { URL_ORIGIN } from './services/config'

const alertManager = new AlertManager()

export default function App() {
  const [guess, setGuess] = useState<null | string>(null)
  const [code, setCode] = useState('')

  const fetchGuess = () => {
    getGuess().then((guess) => {
      if (guess) {
        setGuess(guess)
        setCode(guess)
      } else alertManager.add('Failed to get guess')
    })
  }

  useEffect(() => {
    fetchGuess()
  }, [])

  const [longUrl, setLongUrl] = useState('')
  const [CopiedNotification, onShowCopiedNotification] = useCopiedNotification()

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (longUrl === '') {
      return alertManager.add('Please enter a URL')
    }
    const payload: { url: string; code?: string } = { url: longUrl }
    if (code !== guess) payload.code = code
    const result = await postShorten(payload)
    if (result.ok) {
      setCode(result.code)
      await navigator.clipboard.writeText(`${URL_ORIGIN}/${result.code}`)
      onShowCopiedNotification()
    } else {
      alertManager.add({ DUPLICATE_KEY: 'That URL is already used' }[result.error!]!)
    }
  }

  return (
    <div className="relative">
      <div className="z-20 absolute right-0 mr-4 md:mr-8">
        <AlertGroup alertManager={alertManager}></AlertGroup>
      </div>
      <div className="flex flex-col items-center px-4 pt-4 h-screen dark:bg-slate-800">
        <h1 className="text-6xl sm:text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
          mfus.tk
        </h1>
        <form className="mt-8 flex flex-col" onSubmit={submitHandler}>
          <div className="my-4">
            <Input name="url" value="" autofocus={true} label="Long URL" onChange={(val) => setLongUrl(val)}></Input>
          </div>
          <div className="my-4">
            <Input
              name="code"
              value={code}
              label="Short URL"
              prefix="mfus.tk/"
              onChange={(val) => setCode(val)}
            ></Input>
          </div>
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
    </div>
  )
}
