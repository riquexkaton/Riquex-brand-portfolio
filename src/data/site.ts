export interface Link {
  readonly label: string;
  readonly href: string;
}

export const site = {
  name: 'Enrique Urdaneta',
  jobTitle: 'Full Stack Developer',
  title: 'Enrique Urdaneta — Full Stack Developer',
  description:
    'Portafolio de Enrique Urdaneta, Full Stack Developer: productos web, móviles y de escritorio a medida con TypeScript, React, Vue, Node.js y PostgreSQL.',
  email: 'enriquealejand26@gmail.com',
  alumniOf: 'IUTIRLA',
  portraitAlt: 'Retrato de Enrique Urdaneta',
  // TODO: no backend yet — the contact form shows its error state until this endpoint exists.
  contactEndpoint: '/api/contact',
  // TODO: replace the '#' placeholders with the real profile URLs.
  socials: [
    { label: 'TikTok', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
} as const satisfies {
  name: string;
  jobTitle: string;
  title: string;
  description: string;
  email: string;
  alumniOf: string;
  portraitAlt: string;
  contactEndpoint: string;
  socials: readonly Link[];
};
