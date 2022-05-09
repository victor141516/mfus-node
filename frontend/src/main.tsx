import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BACKEND_BASE_URL } from './services/config'
import './index.css'

// Redirect to the shorted URL in development
;(() => {
  const pathName = window.location.pathname
  if (pathName !== '/') {
    window.location.href = `${BACKEND_BASE_URL}${pathName}`
  }
})()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
