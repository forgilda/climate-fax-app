
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// We don't need to wrap App in a BrowserRouter here
// because App.tsx already contains the BrowserRouter
createRoot(document.getElementById("root")!).render(<App />);
