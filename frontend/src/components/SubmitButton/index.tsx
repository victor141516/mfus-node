import styles from './index.module.css'

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button className={styles.submitButton} type="submit">
      {children}
    </button>
  )
}
