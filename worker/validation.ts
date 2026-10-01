type Field = 'name' | 'email' | 'message';
export type ContactMessage = Record<Field, string>;

type Submission = { kind: 'valid'; message: ContactMessage } | { kind: 'spam' } | { kind: 'invalid'; fields: Field[] };

// Maximum lengths apply after trimming; the form's maxlength attributes (src/data/contact.ts) match them.
// Name and email end up in headers (Subject, Reply-To), so they can't hold control characters.
const RULES: Record<Field, { max: number; pattern?: RegExp }> = {
  name: { max: 100, pattern: /^\P{Cc}+$/u },
  email: { max: 254, pattern: /^[^\s@\p{Cc}]+@[^\s@\p{Cc}]+\.[^\s@\p{Cc}]{2,}$/u },
  message: { max: 5000 },
};
const FIELDS = Object.keys(RULES) as Field[];
// Hidden field that only bots fill. Must match contact.honeypot.name in src/data/contact.ts.
const HONEYPOT = 'website';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const trimmed = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

function isValid(field: Field, value: string): boolean {
  const { max, pattern } = RULES[field];
  return value.length > 0 && value.length <= max && (pattern?.test(value) ?? true);
}

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
  const fields = FIELDS.filter((field) => !isValid(field, message[field]));
  return fields.length > 0 ? { kind: 'invalid', fields } : { kind: 'valid', message };
}
