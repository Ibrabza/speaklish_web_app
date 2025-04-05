import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Import Telegram SDK initialization
import { init } from '@telegram-apps/sdk'
import {postEvent} from "@telegram-apps/sdk";

// Initialize Telegram SDK
init();

postEvent("web_app_set_background_color",{color: "#FFFFFF"})
postEvent("web_app_set_header_color",{ color_key: "bg_color" })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
