import { contact, type ContactFieldName } from '@/data/contact';

import { findInvalidFields, type ContactMessage } from './validation';

const FIELDS: ContactFieldName[] = ['name', 'email', 'message'];

type Control = HTMLInputElement | HTMLTextAreaElement;

interface FormParts {
  form: HTMLFormElement;
  submit: HTMLButtonElement;
  label: HTMLElement;
  failure: HTMLElement;
  success: HTMLElement;
}

const controlOf = (form: HTMLFormElement, field: string): Control | null =>
  form.querySelector<Control>(`[name="${field}"]`);

function showError(control: Control, message: string): void {
  control.setAttribute('aria-invalid', String(message !== ''));
  const error = document.getElementById(`${control.id}-error`);
  if (error) error.textContent = message;
}

function readMessage(form: HTMLFormElement): ContactMessage {
  const data = new FormData(form);
  const value = (field: ContactFieldName): string => {
    const entry = data.get(field);
    return typeof entry === 'string' ? entry.trim() : '';
  };
  return { name: value('name'), email: value('email'), message: value('message') };
}

/** The honeypot travels with the message: the Worker silently drops submissions that fill it. */
function readHoneypot(form: HTMLFormElement): string {
  const entry = new FormData(form).get(contact.honeypot.name);
  return typeof entry === 'string' ? entry : '';
}

/** Shows each field's error (or clears it) and focuses the first invalid control. */
function validate({ form }: FormParts, message: ContactMessage): boolean {
  const invalid = findInvalidFields(message);
  for (const field of FIELDS) {
    const control = controlOf(form, field);
    if (control) showError(control, invalid.includes(field) ? contact.fields[field].error : '');
  }
  if (invalid[0]) controlOf(form, invalid[0])?.focus();
  return invalid.length === 0;
}

function setBusy({ form, submit, label }: FormParts, busy: boolean): void {
  form.setAttribute('aria-busy', String(busy));
  submit.disabled = busy;
  label.textContent = busy ? contact.submit.loading : contact.submit.idle;
}

async function send(parts: FormParts, message: ContactMessage): Promise<void> {
  setBusy(parts, true);
  parts.failure.hidden = true;
  try {
    const response = await fetch(parts.form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...message, [contact.honeypot.name]: readHoneypot(parts.form) }),
    });
    if (!response.ok) throw new Error(`Contact endpoint answered ${String(response.status)}`);
    parts.form.reset();
    parts.form.hidden = true;
    parts.success.hidden = false;
    parts.success.focus();
  } catch {
    parts.failure.hidden = false;
  } finally {
    setBusy(parts, false);
  }
}

function setup(parts: FormParts): void {
  const { form, failure, success } = parts;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.ariaBusy === 'true') return;
    const message = readMessage(form);
    if (validate(parts, message)) void send(parts, message);
  });
  form.addEventListener('input', ({ target }) => {
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) showError(target, '');
    failure.hidden = true;
  });
  success.querySelector('[data-contact-reset]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    controlOf(form, 'name')?.focus();
  });
}

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const submit = form?.querySelector<HTMLButtonElement>('[type="submit"]');
const label = form?.querySelector<HTMLElement>('[data-contact-label]');
const failure = form?.querySelector<HTMLElement>('[data-contact-error]');
const success = document.querySelector<HTMLElement>('[data-contact-success]');
if (form && submit && label && failure && success) setup({ form, submit, label, failure, success });
