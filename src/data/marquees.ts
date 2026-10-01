// Each word list is one half of a seamless loop; the Marquee component renders it twice.

export const heroWords = ['Enrique Urdaneta', 'Full Stack Developer'] as const satisfies readonly string[];

export const specialties = {
  ariaLabel: 'Especialidades',
  words: ['Aplicaciones web', 'Apps móviles', 'Software de escritorio', 'Sistemas a medida', 'APIs', 'Tiempo real'],
} as const satisfies { ariaLabel: string; words: readonly string[] };

const closing = ['Construyamos algo juntos', 'Hablemos'] as const;

export const closingWords = [...closing, ...closing] as const satisfies readonly string[];
