import type { Link } from './site';

export const hero = {
  ariaLabel: 'Presentación',
  heading: 'Enrique Urdaneta, Full Stack Developer',
  tagline: 'Full Stack Developer. Construyo productos web, móviles y de escritorio a medida.',
  cta: { label: 'Hablemos de tu proyecto', href: '#contacto' },
  scroll: { label: 'Haz scroll', href: '#sobre-mi' },
} as const satisfies {
  ariaLabel: string;
  heading: string;
  tagline: string;
  cta: Link;
  scroll: Link;
};
