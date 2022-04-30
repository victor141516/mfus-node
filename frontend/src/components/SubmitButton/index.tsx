import styles from './index.module.css'

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className={`
        ${styles.submitButton}
        inline-flex
        items-center
        px-6
        py-3
        text-base
        font-medium
        rounded-full
        shadow-sm
        text-white
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-primary-400
      `}
      type="submit"
    >
      {children}
    </button>
  )
}
