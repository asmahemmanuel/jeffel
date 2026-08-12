import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// One-time cleanup: remove the old localStorage gallery data left over
// from before the Firebase migration.
try {
  localStorage.removeItem('jeffel-gallery-photos')
} catch {
  // Ignore localStorage errors
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)