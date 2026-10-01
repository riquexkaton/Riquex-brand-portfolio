interface Role {
  readonly period: string;
  readonly company: string;
  readonly role: string;
}

interface Project {
  readonly name: string;
  readonly period: string;
  readonly stack: string;
  readonly description: string;
}

export const experience = {
  title: 'Experiencia',
  label: '(02) 2022 — Actualidad',
  freelance: {
    period: '2025 — Actualidad',
    company: 'Freelance',
    role: '— Full Stack Developer',
    summary: 'Desarrollo de sistemas a medida para distintos clientes.',
  },
  wingsoft: {
    period: 'Mar 2022 — Oct 2025',
    company: 'Wingsoft',
    role: '— Full Stack Developer',
    projectsLabel: 'Proyectos destacados',
  },
  projects: [
    {
      name: 'Lovalledor',
      period: 'Feb 2024 – Oct 2025',
      stack: 'Quasar · Vue',
      description:
        'Ecosistema multiplataforma (web, móvil y escritorio) con Quasar/Vue para la gestión operativa de uno de los mercados mayoristas más grandes de Chile, con comunicación en tiempo real entre supervisores y cajas.',
    },
    {
      name: 'BILU',
      period: 'Oct 2023 – Feb 2024',
      stack: 'NestJS',
      description:
        'Backend en NestJS para una plataforma de experiencias gastronómicas y eventos, con recomendaciones por geolocalización e interacciones sociales.',
    },
    {
      name: 'Global Metrics',
      period: 'Ene 2023 – Oct 2023',
      stack: 'Node.js · TypeORM · Vue',
      description:
        'Lideré el desarrollo de un SaaS de encuestas masivas con Node.js, TypeORM y Vue, incluyendo el módulo de visualización de datos.',
    },
    {
      name: 'Salfa',
      period: 'Jul 2022 – Ene 2023',
      stack: 'Node.js · TypeORM',
      description:
        'Arquitectura Onion con Node.js y TypeORM, e integración de APIs financieras para automatizar créditos automotrices.',
    },
    {
      name: 'Trackmove',
      period: 'May 2022 – Dic 2022',
      stack: 'Next.js · Express · PostgreSQL',
      description:
        'Plataforma de rastreo de vehículos, barcos y aviones con Next.js, API en Express + PostgreSQL y Google Maps API.',
    },
    {
      name: 'Properties Partners',
      period: 'Mar 2022 – May 2022',
      stack: 'Next.js · Bootstrap',
      description:
        'Interfaces para venta de propiedades con Next.js y Bootstrap, optimizando rendimiento en catálogos de alta demanda.',
    },
  ],
} as const satisfies {
  title: string;
  label: string;
  freelance: Role & { summary: string };
  wingsoft: Role & { projectsLabel: string };
  projects: readonly Project[];
};
