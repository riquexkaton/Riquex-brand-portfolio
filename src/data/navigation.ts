import type { Link } from './site';

export const header = {
  skipLink: { label: 'Saltar al contenido', href: '#sobre-mi' },
  home: { label: 'Enrique Urdaneta', ariaLabel: 'Enrique Urdaneta, inicio', href: '#top' },
  menuButton: 'Menú',
} as const satisfies { skipLink: Link; home: Link & { ariaLabel: string }; menuButton: string };

export const menu = {
  ariaLabel: 'Menú de navegación',
  navAriaLabel: 'Secciones',
  heading: 'Navegación',
  close: 'Cerrar',
  links: [
    { label: 'Inicio', href: '#top' },
    { label: 'Sobre mí', href: '#sobre-mi' },
    { label: 'Experiencia', href: '#experiencia' },
    { label: 'Tecnologías', href: '#tecnologias' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Contacto', href: '#contacto' },
  ],
} as const satisfies {
  ariaLabel: string;
  navAriaLabel: string;
  heading: string;
  close: string;
  links: readonly Link[];
};

export const footer = {
  emailLabel: 'Email',
  socialsLabel: 'Redes',
  backToTop: { label: 'Volver arriba ↑', href: '#top' },
} as const satisfies { emailLabel: string; socialsLabel: string; backToTop: Link };
