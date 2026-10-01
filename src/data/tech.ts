import {
  siCss,
  siExpress,
  siGit,
  siGooglemaps,
  siHtml5,
  siJavascript,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siQuasar,
  siReact,
  siSass,
  siSupabase,
  siTailwindcss,
  siTypeorm,
  siTypescript,
  siVuedotjs,
} from 'simple-icons';

interface Tech {
  readonly name: string;
  /** Simple Icons glyph (24×24 viewBox). Omitted when there is no brand logo. */
  readonly icon?: { readonly path: string };
}

interface TechGroup {
  readonly label: string;
  readonly items: readonly Tech[];
}

export const tech = {
  title: 'Tecnologías',
  label: '(03) Stack',
  groups: [
    {
      label: 'Frontend',
      items: [
        { name: 'HTML', icon: siHtml5 },
        { name: 'CSS', icon: siCss },
        { name: 'SASS', icon: siSass },
        { name: 'Tailwind', icon: siTailwindcss },
        { name: 'JavaScript', icon: siJavascript },
        { name: 'TypeScript', icon: siTypescript },
        { name: 'React', icon: siReact },
        { name: 'Next.js', icon: siNextdotjs },
        { name: 'Vue', icon: siVuedotjs },
        { name: 'Quasar', icon: siQuasar },
      ],
    },
    {
      label: 'Backend',
      items: [
        { name: 'Node.js', icon: siNodedotjs },
        { name: 'Express', icon: siExpress },
        { name: 'NestJS', icon: siNestjs },
        { name: 'TypeORM', icon: siTypeorm },
      ],
    },
    {
      label: 'Datos y servicios',
      items: [
        { name: 'SQL' },
        { name: 'PostgreSQL', icon: siPostgresql },
        { name: 'Supabase', icon: siSupabase },
        { name: 'Google Maps API', icon: siGooglemaps },
      ],
    },
    {
      label: 'Herramientas',
      items: [{ name: 'Git', icon: siGit }],
    },
  ],
} as const satisfies { title: string; label: string; groups: readonly TechGroup[] };
