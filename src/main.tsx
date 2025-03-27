import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Import Telegram SDK initialization
import { init } from '@telegram-apps/sdk'

// Initialize Telegram SDK
init();
if (window.Telegram?.WebApp) {
    console.log("✅ Telegram WebApp initialized:", window.Telegram.WebApp);
} else {
    console.error("❌ Telegram WebApp is NOT available. Are you running this inside Telegram?");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
