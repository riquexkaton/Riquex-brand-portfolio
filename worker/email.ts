import type { Env } from './env';
import type { ContactMessage } from './validation';

type Addresses = Pick<Env, 'CONTACT_FROM' | 'CONTACT_TO'>;

// Header values (subject, display name) must never carry line breaks or other control characters.
const headerSafe = (value: string): string => value.replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, ' ').trim();

/** Plain-text notification for the site owner. Replying goes straight to the visitor. */
export function composeEmail(message: ContactMessage, addresses: Addresses, site: string): EmailMessageBuilder {
  const name = headerSafe(message.name);
  const text = [
    `Nombre: ${name}`,
    `Email: ${message.email}`,
    '',
    'Mensaje:',
    message.message,
    '',
    '—',
    `Enviado desde el formulario de contacto de ${site}. Responde a este correo para contestarle a ${name}.`,
  ].join('\n');
  return {
    from: addresses.CONTACT_FROM,
    to: addresses.CONTACT_TO,
    replyTo: { email: message.email, name },
    subject: `Nuevo mensaje de ${name} — ${site}`,
    text,
  };
}
