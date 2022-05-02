import styles from './index.module.css'

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className={`
        ${styles.submitButton}
        inline-flex
        items-center
        px-12
        py-6
        text-4xl
        font-light
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
