import { XCircleIcon } from '@heroicons/react/solid'
import { useEffect, useRef, useState } from 'react'
import { AlertManager } from '../services/alerts'

function Alert({ children, remove }: { children: string; remove: (msg: string) => void }) {
  return (
    <div className="cursor-pointer rounded-md bg-red-400 p-4">
      <div className="flex items-center w-full">
        <XCircleIcon onClick={() => remove(children)} className="h-5 w-5 text-red-200" aria-hidden="true" />
        <div className="ml-3 flex-1">
          <span className="text-sm font-medium text-red-50">{children}</span>
        </div>
      </div>
    </div>
  )
}

export function AlertGroup({ alertManager }: { alertManager: AlertManager }) {
  const [alerts, setAlerts] = useState<Array<{ message: string; timeout: number }>>([])

  useEffect(() => {
    const ts = alerts.map(
      ({ message, timeout }) => {
        const t = Math.max(timeout - Date.now(), 0)
        return setTimeout(() => removeAlert(message), t)
      },
      [alerts],
    )

    return () => ts.forEach((t) => clearTimeout(t))
  }, [alerts])

  const addMessage = (message: string) => {
    setAlerts([...alerts, { message, timeout: Date.now() + 5000 }])
  }

  const removeAlert = (message: string) => {
    alertManager.remove(message)
    setAlerts(alerts.filter((a) => a.message !== message))
  }

  alertManager.onAlert((msg) => addMessage(msg))

  return (
    <>
      {alerts.map(({ message }, index) => (
        <div className="my-4 max-w-full w-80" key={index}>
          <Alert remove={removeAlert}>{message}</Alert>
        </div>
      ))}
    </>
  )
}
