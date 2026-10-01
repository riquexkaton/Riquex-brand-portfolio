export const about = {
  label: '(01) Sobre mí',
  statement:
    'Aprendí a programar por mi cuenta y llevo más de cuatro años construyendo productos web, móviles y de escritorio para clientes de retail mayorista, fintech automotriz, SaaS y geolocalización. Hoy desarrollo sistemas a medida de forma independiente.',
  facts: [
    { term: 'Formación', detail: 'T.S.U. en Informática, IUTIRLA (2019 – 2021)' },
    { term: 'Rol', detail: 'Full Stack Developer' },
  ],
} as const satisfies {
  label: string;
  statement: string;
  facts: readonly { term: string; detail: string }[];
};
