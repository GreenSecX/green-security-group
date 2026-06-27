import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PhishingSpotter from './PhishingSpotter.jsx'
import Security from './Security.jsx'
import IncidentResponse from './IncidentResponse.jsx'
const path = window.location.pathname
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {path === '/phishing-spotter' ? <PhishingSpotter />
      : path === '/security' ? <Security />
      : path === '/incident-response' ? <IncidentResponse />
      : <App />}
  </React.StrictMode>
)
