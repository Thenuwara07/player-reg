// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// createRoot(document.getElementById("root")!).render(<App />);


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 1. Import the Provider (Check that the path matches where you saved the previous file)
import { GlobalSettingsProvider } from './contexts/GlobalSettingsContext.tsx' 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 2. Wrap App with the Provider so the variables are accessible everywhere */}
    <GlobalSettingsProvider>
      <App />
    </GlobalSettingsProvider>
  </StrictMode>
);