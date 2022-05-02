import styles from './index.module.css'

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className={`
        ${styles.submitButton}
        inline-flex
        items-center
        md:px-12
        md:py-6
        px-8
        py-3
        text-2xl
        md:text-4xl
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
