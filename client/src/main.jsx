// Self-hosted fonts. No Google Fonts <link> in production. (skill 3.A)
//
// Latin subset only. The default per-weight entry pulls latin-ext as well,
// which emitted 60 font files totalling 605 KB for an English page.
// Three families, the weights actually used, latin only.
import '@fontsource/syne/latin-600.css';
import '@fontsource/syne/latin-700.css';
import '@fontsource/syne/latin-800.css';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-500.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import './index.css';
import App from './App.jsx';
import { DARK_TOASTER } from './theme/toaster.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster {...DARK_TOASTER} />
  </StrictMode>,
);
