import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { LanguageProvider } from './hooks/useLanguage';
import './styles/globals.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#c96442' },
    secondary: { main: '#d97757' },
    background: { default: '#0a0a0f', paper: '#111118' },
    text: { primary: '#faf9f5', secondary: '#b0aea5' },
  },
  typography: {
    fontFamily: '"Space Grotesk", "JetBrains Mono", monospace',
    h1: { fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1 },
    h2: { fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 600, lineHeight: 1.2 },
    h3: { fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 600, lineHeight: 1.3 },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 12, padding: '10px 24px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { background: 'rgba(17, 17, 24, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201, 100, 66, 0.2)', borderRadius: 16 },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
