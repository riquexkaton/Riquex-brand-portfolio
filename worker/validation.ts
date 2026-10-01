type Field = 'name' | 'email' | 'message';
export type ContactMessage = Record<Field, string>;

type Submission = { kind: 'valid'; message: ContactMessage } | { kind: 'spam' } | { kind: 'invalid'; fields: Field[] };

// Same rules as the form (src/features/contact/validation.ts), same limits as src/data/contact.ts: what one
// accepts, the other does too. Lengths are of the trimmed value.
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}\s'.-]*$/u;
// The address ends up in the Reply-To header, so no whitespace or control characters. The name ends up in
// headers too (Subject, Reply-To): composeEmail flattens its whitespace with headerSafe.
const EMAIL_PATTERN = /^[^\s@\p{Cc}]+@[^\s@\p{Cc}]+\.[^\s@.\p{Cc}]{2,}$/u;

const within = (value: string, min: number, max: number): boolean => value.length >= min && value.length <= max;

const RULES: Record<Field, (value: string) => boolean> = {
  name: (value) => within(value, 2, 60) && NAME_PATTERN.test(value),
  email: (value) => within(value, 1, 254) && EMAIL_PATTERN.test(value) && !value.includes('..'),
  message: (value) => within(value, 10, 1000),
};
const FIELDS = Object.keys(RULES) as Field[];
// Hidden field that only bots fill. Must match contact.honeypot.name in src/data/contact.ts.
const HONEYPOT = 'website';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const trimmed = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** Parses a JSON body, or returns undefined when it isn't valid JSON. */
export function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Classifies a parsed body. A filled honeypot counts as spam whatever the other fields hold. */
export function readSubmission(body: unknown): Submission {
  if (!isRecord(body)) return { kind: 'invalid', fields: FIELDS };
  if (trimmed(body[HONEYPOT]) !== '') return { kind: 'spam' };
  const message = { name: trimmed(body.name), email: trimmed(body.email), message: trimmed(body.message) };
  const fields = FIELDS.filter((field) => !RULES[field](message[field]));
  return fields.length > 0 ? { kind: 'invalid', fields } : { kind: 'valid', message };
}
