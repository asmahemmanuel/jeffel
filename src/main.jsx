import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// One-time cleanup: remove the old localStorage gallery data left over
// from before the Firebase migration. This was being parsed on every
// page load and was the actual cause of the "stuck after refresh" scroll issue.
try {
  localStorage.removeItem('jeffel-gallery-photos')
} catch {
  // ignore
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)