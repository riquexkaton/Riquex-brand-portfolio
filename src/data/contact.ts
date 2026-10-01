export type ContactFieldName = 'name' | 'email' | 'message';

export interface FieldSpec {
  readonly label: string;
  readonly placeholder: string;
  /** Length limits of the trimmed value. The /api/contact Worker mirrors them (worker/validation.ts). */
  readonly minLength?: number;
  readonly maxLength: number;
  /** Shows a "length/maxLength" counter. It turns paper from `near` characters on, and error at the limit. */
  readonly counter?: { readonly near?: number };
  /**
   * Validation messages by rule. `{n}` stands for the characters still missing to reach minLength;
   * `tooShortOne` is the singular form used when exactly one is missing.
   */
  readonly errors: Readonly<Record<string, string>>;
}

export const contact = {
  label: '(05) Contacto',
  title: 'Hablemos',
  intro: '¿Tienes un proyecto o una idea que quieras llevar a producción? Escríbeme y conversemos.',
  emailLabel: 'Email directo',
  socialsLabel: 'Redes',
  fields: {
    name: {
      label: 'Nombre',
      placeholder: 'Tu nombre',
      minLength: 2,
      maxLength: 60,
      // No warning step: the counter only changes colour at the limit.
      counter: {},
      errors: {
        required: 'El nombre es obligatorio.',
        tooShort: 'El nombre debe tener al menos 2 caracteres.',
        tooLong: 'El nombre no puede superar 60 caracteres.',
        pattern: 'Usa solo letras, espacios, apóstrofos o guiones.',
      },
    },
    email: {
      label: 'Email',
      placeholder: 'tu@email.com',
      maxLength: 254,
      errors: {
        required: 'El email es obligatorio.',
        spaces: 'El email no puede contener espacios.',
        missingAt: 'Falta el símbolo @ en el email.',
        format: 'Introduce un email válido, por ejemplo nombre@dominio.com.',
        tooLong: 'El email es demasiado largo.',
      },
    },
    message: {
      label: 'Mensaje',
      placeholder: 'Cuéntame sobre tu proyecto',
      minLength: 10,
      maxLength: 1000,
      counter: { near: 900 },
      errors: {
        required: 'El mensaje es obligatorio.',
        tooShort: 'Cuéntame un poco más: faltan {n} caracteres (mínimo 10).',
        tooShortOne: 'Cuéntame un poco más: falta 1 carácter (mínimo 10).',
        tooLong: 'El mensaje no puede superar 1000 caracteres.',
      },
    },
  },
  // Hidden from people and assistive tech; bots that fill it are dropped by the Worker.
  honeypot: { name: 'website', label: 'Sitio web' },
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
  fields: Record<ContactFieldName, FieldSpec>;
  honeypot: { name: string; label: string };
  submit: { idle: string; loading: string };
  failure: string;
  success: { title: string; body: string; reset: string };
};
