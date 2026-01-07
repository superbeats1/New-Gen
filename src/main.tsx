import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('%c 🚨 SCOPA AI CORE v2.1.0 - REDDIT EXPANSION ACTIVE 🚨 ', 'background: #00ff00; color: black; padding: 10px; border-radius: 8px; font-weight: 900; font-size: 14px; border: 2px solid black;');
(window as any).SCOPA_VERSION = '2.1.0';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)