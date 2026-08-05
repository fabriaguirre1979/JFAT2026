import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import App from '../App';
import Home from '../pages/Home';

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const routeTree = rootRoute.addChildren([indexRoute]);

/**
 * Basepath dinámico — la app vive en una subruta en GitHub Pages
 * (/JFAT2026/) y en la raíz (/) cuando apunte el dominio custom is-a.dev.
 * Con base: './' en Vite, BASE_URL resuelto contra la URL actual da el
 * prefijo correcto en ambos casos.
 */
const resolveBasepath = () => {
  if (typeof window === 'undefined') return '/';
  const url = new URL(window.location.href);
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  const base = new URL(import.meta.env.BASE_URL, url.href).pathname;
  return base.replace(/\/+$/, '') || '/';
};

export const router = createRouter({ routeTree, basepath: resolveBasepath() });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
