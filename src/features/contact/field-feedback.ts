import { contact, type ContactFieldName } from '@/data/contact';

import { renderCounter } from './counter';
import { maskName } from './name-mask';
import { errorOf } from './validation';

type Control = HTMLInputElement | HTMLTextAreaElement;
type Field = Control & { name: ContactFieldName };

const NAMES: readonly string[] = Object.keys(contact.fields);

/** One of the form's own fields (not the honeypot). */
const isField = (target: unknown): target is Field =>
  (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && NAMES.includes(target.name);

export const controlOf = (form: HTMLFormElement, field: ContactFieldName): Control | null =>
  form.querySelector<Control>(`[name="${field}"]`);

/** Shows the message under the control (an empty one clears it). Returns whether the control is valid. */
function showError(control: Control, message: string): boolean {
  control.setAttribute('aria-invalid', String(message !== ''));
  const error = document.getElementById(`${control.id}-error`);
  // Rewriting identical text could make the live region announce it again.
  if (error && error.textContent !== message) error.textContent = message;
  return message === '';
}

const check = (field: Field): boolean => showError(field, errorOf(field.name, field.value.trim()));

function applyNameMask(field: Field): void {
  const { maxLength } = contact.fields.name;
  const { value, caret } = maskName(field.value, field.selectionStart ?? field.value.length, maxLength);
  if (value === field.value) return;
  field.value = value;
  if (document.activeElement === field) field.setSelectionRange(caret, caret);
}

/**
 * Live feedback for the contact fields: masks the name, keeps the counters current, and shows a
 * field's error only once it's touched (left with something typed in, or submitted); from then on
 * the error follows every edit. Returns the submit check: it touches every field, shows every
 * error and focuses the first invalid control.
 */
export function watchFields(form: HTMLFormElement): () => boolean {
  const fields = Array.from(form.elements).filter(isField);
  const touched = new Set<ContactFieldName>();

  const update = (field: Field, composing: boolean): void => {
    // Rewriting the value mid-composition (IME, dead keys) would break it: mask once it's committed.
    if (field.name === 'name' && !composing) applyNameMask(field);
    renderCounter(field);
    if (touched.has(field.name)) check(field);
  };

  form.addEventListener('input', (event) => {
    if (isField(event.target)) update(event.target, event instanceof InputEvent && event.isComposing);
  });
  form.addEventListener('compositionend', ({ target }) => {
    if (isField(target)) update(target, false);
  });
  form.addEventListener('focusout', ({ target }) => {
    // Tabbing through a field that was never typed in isn't a mistake yet.
    if (!isField(target) || (!touched.has(target.name) && target.value === '')) return;
    touched.add(target.name);
    check(target);
  });
  form.addEventListener('reset', () => {
    touched.clear();
    // The reset event fires before the values are restored, so count the defaults.
    for (const field of fields) {
      showError(field, '');
      renderCounter(field, field.defaultValue.length);
    }
  });
  // The browser may have restored values (reload, back/forward cache).
  for (const field of fields) renderCounter(field);

  return () => {
    for (const field of fields) touched.add(field.name);
    const invalid = fields.filter((field) => !check(field));
    invalid[0]?.focus();
    return invalid.length === 0;
  };
}
