import type { ContactFieldName } from '@/data/contact';

export type ContactMessage = Record<ContactFieldName, string>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const RULES: Record<ContactFieldName, (value: string) => boolean> = {
  name: (value) => value.length >= 2,
  email: (value) => EMAIL_PATTERN.test(value),
  message: (value) => value.length >= 10,
};

/** Returns the invalid fields, in form order. Values must be trimmed by the caller. */
export function findInvalidFields(message: ContactMessage): ContactFieldName[] {
  return (Object.keys(RULES) as ContactFieldName[]).filter((field) => !RULES[field](message[field]));
}
