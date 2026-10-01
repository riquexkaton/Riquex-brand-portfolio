import { contact, type ContactFieldName } from '@/data/contact';

import { controlOf, watchFields } from './field-feedback';

type ContactMessage = Record<ContactFieldName, string>;

interface FormParts {
  form: HTMLFormElement;
  fields: HTMLFieldSetElement;
  label: HTMLElement;
  failure: HTMLElement;
  success: HTMLElement;
}

/** The trimmed values, read from the controls just like the field checks that validated them. */
function readMessage(form: HTMLFormElement): ContactMessage {
  const value = (field: ContactFieldName): string => controlOf(form, field)?.value.trim() ?? '';
  return { name: value('name'), email: value('email'), message: value('message') };
}

/**
 * The honeypot travels with the message: the Worker silently drops submissions that fill it.
 * Serialize before disabling the fieldset, since FormData leaves disabled controls out.
 */
function payloadOf(form: HTMLFormElement, message: ContactMessage): string {
  const entry = new FormData(form).get(contact.honeypot.name);
  return JSON.stringify({ ...message, [contact.honeypot.name]: typeof entry === 'string' ? entry : '' });
}

function setBusy({ form, fields, label }: FormParts, busy: boolean): void {
  form.setAttribute('aria-busy', String(busy));
  fields.disabled = busy;
  label.textContent = busy ? contact.submit.loading : contact.submit.idle;
}

async function post(url: string, body: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    return response.ok;
  } catch {
    return false;
  }
}

async function send(parts: FormParts, body: string): Promise<void> {
  // Disabling the focused control drops focus to <body>; a failed send gives it back.
  const focused = document.activeElement;
  setBusy(parts, true);
  parts.failure.hidden = true;
  const sent = await post(parts.form.action, body);
  setBusy(parts, false);
  if (!sent) {
    parts.failure.hidden = false;
    if (focused instanceof HTMLElement) focused.focus();
    return;
  }
  parts.form.reset();
  parts.form.hidden = true;
  parts.success.hidden = false;
  parts.success.focus();
}

function setup(parts: FormParts): void {
  const { form, failure, success } = parts;
  const validate = watchFields(form);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.ariaBusy === 'true' || !validate()) return;
    void send(parts, payloadOf(form, readMessage(form)));
  });
  form.addEventListener('input', () => {
    failure.hidden = true;
  });
  success.querySelector('[data-contact-reset]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    controlOf(form, 'name')?.focus();
  });
}

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
const fields = form?.querySelector<HTMLFieldSetElement>('[data-contact-fields]');
const label = form?.querySelector<HTMLElement>('[data-contact-label]');
const failure = form?.querySelector<HTMLElement>('[data-contact-error]');
const success = document.querySelector<HTMLElement>('[data-contact-success]');
if (form && fields && label && failure && success) setup({ form, fields, label, failure, success });
