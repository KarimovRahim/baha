import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import { MenuProvider } from './contexts/MenuContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Suspense fallback={null}>
        <MenuProvider>
          <App />
        </MenuProvider>
      </Suspense>
    </ThemeProvider>
  </StrictMode>,
);
