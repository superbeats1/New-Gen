import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('%c SIGNAL UI v2.0 - LOADED ', 'background: #7c3aed; color: white; padding: 4px; border-radius: 4px; font-weight: bold;');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)