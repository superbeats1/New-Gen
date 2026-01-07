import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('%c SCOPA AI UI v1.1 - PROTOCOL ACTIVE ', 'background: #7c3aed; color: white; padding: 4px; border-radius: 4px; font-weight: bold;');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)