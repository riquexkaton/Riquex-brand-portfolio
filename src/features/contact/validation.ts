import { contact, type ContactFieldName, type FieldSpec } from '@/data/contact';

type Rule = readonly [fails: (value: string) => boolean, error: string];

const { name, email, message } = contact.fields;

// The /api/contact Worker (worker/validation.ts) accepts exactly what these rules accept.
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}\s'.-]*$/u;
// No whitespace or control characters: the Worker puts the address in the Reply-To header.
const EMAIL_PATTERN = /^[^\s@\p{Cc}]+@[^\s@\p{Cc}]+\.[^\s@.\p{Cc}]{2,}$/u;

/** Per field, in order: the first rule that fails names the error. */
const RULES: Record<ContactFieldName, readonly Rule[]> = {
  name: [
    [(value) => value === '', name.errors.required],
    [(value) => value.length < name.minLength, name.errors.tooShort],
    [(value) => value.length > name.maxLength, name.errors.tooLong],
    [(value) => !NAME_PATTERN.test(value), name.errors.pattern],
  ],
  email: [
    [(value) => value === '', email.errors.required],
    [(value) => /\s/u.test(value), email.errors.spaces],
    [(value) => !value.includes('@'), email.errors.missingAt],
    [(value) => !EMAIL_PATTERN.test(value) || value.includes('..'), email.errors.format],
    [(value) => value.length > email.maxLength, email.errors.tooLong],
  ],
  message: [
    [(value) => value === '', message.errors.required],
    [(value) => value.length < message.minLength, message.errors.tooShort],
    [(value) => value.length > message.maxLength, message.errors.tooLong],
  ],
};

/** The error to show for a trimmed value, or '' when it's valid. */
export function errorOf(field: ContactFieldName, value: string): string {
  const error = RULES[field].find(([fails]) => fails(value))?.[1] ?? '';
  const { minLength = 0, errors }: FieldSpec = contact.fields[field];
  const missing = minLength - value.length;
  if (missing === 1 && error === errors.tooShort && errors.tooShortOne) return errors.tooShortOne;
  return error.replace('{n}', String(missing));
}
