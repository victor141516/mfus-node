import { useState } from 'react'
import style from './index.module.css'

export const useCopiedNotification = () => {
  const [show, setShow] = useState(false)
  const [animationClasses, setAnimationClasses] = useState('')
  const onShow = async () => {
    setShow(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setAnimationClasses(style.animated)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setAnimationClasses('')
    setShow(false)
  }
  const element = () => {
    return (
      <div className={`${animationClasses} mt-4`}>
        {show ? <span className="font-bold text-primary-600 dark:text-primary-200">Copied to clipboard!</span> : null}
      </div>
    )
  }

  return [element, onShow] as [() => JSX.Element, () => Promise<void>]
}
