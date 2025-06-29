import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Import Telegram SDK initialization
import { init, postEvent, backButton, closingBehavior } from '@telegram-apps/sdk'

// Initialize Telegram SDK
init();
backButton.mount();
closingBehavior.mount();

if (closingBehavior.enableConfirmation.isAvailable()) {
    closingBehavior.enableConfirmation();
}


postEvent("web_app_set_background_color",{color: "#FFFFFF"})
postEvent("web_app_set_header_color",{ color: "#FFFFFF" })
postEvent("web_app_set_bottom_bar_color",{ color: "#FFFFFF" })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
