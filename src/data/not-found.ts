import type { Link } from './site';

export const notFound = {
  title: 'Página no encontrada — Enrique Urdaneta',
  label: 'Error 404',
  heading: 'Página no encontrada',
  body: 'La página que buscas no existe o fue movida.',
  home: { label: 'Volver al inicio', href: '/' },
} as const satisfies { title: string; label: string; heading: string; body: string; home: Link };
