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
  // Email Routing forwards it to the personal inbox, which stays off the public site.
  email: 'enrique@enriqueurdaneta.dev',
  alumniOf: 'IUTIRLA',
  portraitAlt: 'Retrato de Enrique Urdaneta',
  // Served by the Worker in worker/ (the only path that skips the static assets).
  contactEndpoint: '/api/contact',
  socials: [
    { label: 'TikTok', href: 'https://www.tiktok.com/@riquex_developer' },
    { label: 'Instagram', href: 'https://www.instagram.com/riquex_developer/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/enrique-urdaneta-dev/' },
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
