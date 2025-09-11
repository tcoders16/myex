import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleCalendarAuthProvider } from './context/GoogleCalendarAuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleCalendarAuthProvider>
      <App  />
    </GoogleCalendarAuthProvider>
  </StrictMode>,
)
