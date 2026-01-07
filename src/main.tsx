import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('%c 🚨 SCOPA AI CORE v1.7.0 - CRITICAL STABILITY - CACHE INVALIDATED 🚨 ', 'background: #ff0000; color: white; padding: 10px; border-radius: 8px; font-weight: 900; font-size: 14px; border: 2px solid white;');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)