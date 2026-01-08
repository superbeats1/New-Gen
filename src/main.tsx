import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('%c 🎯 SCOPA AI v2.16.1 - API FIXES DEPLOYED! 🎯 ', 'background: #10b981; color: #fff; padding: 10px; border-radius: 8px; font-weight: 900; font-size: 14px; border: 2px solid #fff;');
(window as any).SCOPA_VERSION = '2.16.1';
(window as any).GEMINI_MODEL = 'gemini-3-pro-preview';
(window as any).SDK = '@google/genai v1.34.0';
(window as any).DATA_SOURCES = 'Twitter + Reddit + HackerNews + GitHub';
(window as any).ARCHITECTURE = 'Serverless API Proxies (CORS-free)';

// --- NEURAL STABILITY MONITOR v2.1 ---
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  console.error('🔮 NEURAL SYNC FAILURE DETECTED:', reason);

  // High-fidelity trace for matching errors
  if (reason?.message?.includes('match') || reason?.message?.includes('undefined')) {
    console.warn('🎯 CRITICAL TRACE CAPTURED:', {
      message: reason?.message,
      stack: reason?.stack,
      rawReason: reason
    });
  }
});

window.onerror = (message, source, lineno, colno, error) => {
  console.error('🔥 CRITICAL CORE BREACH:', { message, source, lineno, colno, error });
  return false;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)