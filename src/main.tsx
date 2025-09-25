import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleCalendarAuthProvider } from './context/GoogleCalendarAuthContext.tsx'



const saved = localStorage.getItem("ui-scale") as "sm"|"md"|"lg"|"xl"|null;
document.documentElement.setAttribute("data-ui", saved || "md");



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleCalendarAuthProvider>
      <App  />
    </GoogleCalendarAuthProvider>
  </StrictMode>,
)
