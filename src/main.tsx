import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { AppRouter } from './router';
import { ToastProvider } from './components/ui/Toast';
import { applyAssetCssVars } from './lib/assets';
import './styles/tokens.css';
import './styles/global.css';

applyAssetCssVars();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AppRouter />
      <ToastProvider />
    </HelmetProvider>
  </StrictMode>,
);
