import type { ImageMetadata } from 'astro';

import pulse from '@/assets/projects/pulse.png';
import riquexOs from '@/assets/projects/riquex-os.webp';
import riquex from '@/assets/projects/riquex.webp';

import type { Link } from './site';

interface Project {
  readonly title: string;
  readonly type: string;
  readonly stack: string;
  readonly year: string;
  readonly image: ImageMetadata;
  /** Describes the screenshot; the title is already announced by the card heading. */
  readonly alt: string;
  readonly url: string;
}

export const projects = {
  title: 'Proyectos',
  label: '(04) Trabajo seleccionado',
  carousel: {
    roleDescription: 'carrusel',
    ariaLabel: 'Galería de proyectos. Haz scroll o usa las flechas del teclado para navegar.',
    skip: { label: 'Saltar proyectos', href: '#contacto' },
    previous: 'Proyecto anterior',
    next: 'Proyecto siguiente',
    navigate: 'Navegar',
    cardLabel: (position: number, total: number, title: string) => `${position} de ${total}: ${title}`,
    visit: 'Visitar sitio',
    visitLabel: (title: string) => `Visitar ${title} (se abre en una pestaña nueva)`,
  },
  items: [
    {
      title: 'Pulse',
      type: 'Juego de ritmo',
      stack: 'TypeScript · Three.js · Web Audio',
      year: '2026',
      image: pulse,
      alt: 'Pantalla de inicio de Pulse con el botón Jugar',
      url: 'https://music-game-nu.vercel.app/',
    },
    {
      title: 'Riquex',
      type: 'Juego de cartas',
      stack: 'Next.js · Three.js · GSAP',
      year: '2026',
      image: riquex,
      alt: 'Menú principal de Riquex con ilustraciones de sus cartas',
      url: 'https://card-game-eight-kohl.vercel.app/',
    },
    {
      title: 'Riquex OS',
      type: 'Sistema operativo web',
      stack: 'Next.js · Zustand · Motion',
      year: '2026',
      image: riquexOs,
      alt: 'Escritorio de Riquex OS con reloj, barra de menús y dock de aplicaciones',
      url: 'https://my-portfolio-lake-rho-20.vercel.app/',
    },
  ],
} as const satisfies {
  title: string;
  label: string;
  carousel: {
    roleDescription: string;
    ariaLabel: string;
    skip: Link;
    previous: string;
    next: string;
    navigate: string;
    cardLabel: (position: number, total: number, title: string) => string;
    visit: string;
    visitLabel: (title: string) => string;
  };
  items: readonly Project[];
};
