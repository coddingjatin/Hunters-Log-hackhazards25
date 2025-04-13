
import React from 'react'; // Ensure React is imported first
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use React.StrictMode to catch potential problems
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
