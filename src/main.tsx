import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import App from './App.tsx'
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
      <StrictMode>
        <App />
      </StrictMode>
  </PrimeReactProvider>
)
