export type ContactFieldName = 'name' | 'email' | 'message';

interface FieldCopy {
  readonly label: string;
  readonly placeholder: string;
  readonly error: string;
}

export const contact = {
  label: '(05) Contacto',
  title: 'Hablemos',
  intro: '¿Tienes un proyecto o una idea que quieras llevar a producción? Escríbeme y conversemos.',
  emailLabel: 'Email directo',
  socialsLabel: 'Redes',
  fields: {
    name: { label: 'Nombre', placeholder: 'Tu nombre', error: 'Escribe tu nombre.' },
    email: { label: 'Email', placeholder: 'tu@email.com', error: 'Introduce un email válido.' },
    message: {
      label: 'Mensaje',
      placeholder: 'Cuéntame sobre tu proyecto',
      error: 'Cuéntame un poco más (mínimo 10 caracteres).',
    },
  },
  submit: { idle: 'Enviar mensaje', loading: 'Enviando…' },
  failure: 'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme directamente por email.',
  success: {
    title: 'Mensaje enviado.',
    body: 'Gracias por escribir. Te responderé a la brevedad.',
    reset: 'Enviar otro mensaje',
  },
} as const satisfies {
  label: string;
  title: string;
  intro: string;
  emailLabel: string;
  socialsLabel: string;
  fields: Record<ContactFieldName, FieldCopy>;
  submit: { idle: string; loading: string };
  failure: string;
  success: { title: string; body: string; reset: string };
};
