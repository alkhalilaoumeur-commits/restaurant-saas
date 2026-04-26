import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Lokale Fonts (NICHT via Google CDN — DSGVO/LG Muenchen 2022).
// @fontsource bundelt die Schriften ins eigene Asset, kein Google-Tracking.
import '@fontsource/karla/300.css';
import '@fontsource/karla/400.css';
import '@fontsource/karla/500.css';
import '@fontsource/karla/600.css';
import '@fontsource/karla/700.css';
import '@fontsource/playfair-display-sc/400.css';
import '@fontsource/playfair-display-sc/700.css';

// Globale Fehler: nur in Konsole loggen — App nie zerstören
window.addEventListener('error', (e) => {
  console.error('[App Fehler]', e.message, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Rejection]', e.reason);
});

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (err) {
  document.body.innerHTML = `<pre style="color:red;padding:2rem;font-size:14px;">RENDER FEHLER: ${err}</pre>`;
}
