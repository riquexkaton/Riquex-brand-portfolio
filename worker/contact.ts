import { composeEmail } from './email';
import type { Env } from './env';
import { fail, json, readText } from './http';
import { parseJson, readSubmission, type ContactMessage } from './validation';

// A full form (1000 + 60 + 254 characters, at most 6 bytes each once JSON-escaped) plus the keys fits.
const MAX_BODY_BYTES = 16 * 1024;

const isJson = (request: Request): boolean =>
  request.headers.get('Content-Type')?.split(';')[0]?.trim().toLowerCase() === 'application/json';

// The form posts from the same origin. No CORS headers are ever sent, and this also stops cross-site
// <form> posts and scripted requests that don't bother to fake the header.
const isSameOrigin = (request: Request): boolean => request.headers.get('Origin') === new URL(request.url).origin;

async function isRateLimited(request: Request, env: Env): Promise<boolean> {
  const key = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await env.CONTACT_LIMITER.limit({ key });
  return !success;
}

/** Answers requests that aren't an allowed same-origin JSON POST; null lets the request through. */
async function reject(request: Request, env: Env): Promise<Response | null> {
  if (request.method !== 'POST') return fail(405, 'method_not_allowed', { Allow: 'POST' });
  if (!isJson(request)) return fail(415, 'unsupported_media_type');
  if (!isSameOrigin(request)) return fail(403, 'forbidden');
  if (await isRateLimited(request, env)) return fail(429, 'rate_limited', { 'Retry-After': '60' });
  return null;
}

function errorCode(error: unknown): string {
  if (!(error instanceof Error)) return 'unknown';
  return 'code' in error && typeof error.code === 'string' ? error.code : error.name;
}

async function send(message: ContactMessage, env: Env, site: string): Promise<Response> {
  if (!env.CONTACT_TO) {
    console.error('contact: the CONTACT_TO secret is not set');
    return fail(500, 'not_configured');
  }
  try {
    await env.CONTACT_EMAIL.send(composeEmail(message, env, site));
    return json(200, { ok: true });
  } catch (error) {
    // Only the error code is logged: the message and the visitor's address stay out of the logs.
    console.error('contact: send failed', errorCode(error));
    return fail(502, 'send_failed');
  }
}

export async function handleContact(request: Request, env: Env): Promise<Response> {
  const rejection = await reject(request, env);
  if (rejection) return rejection;
  const body = await readText(request, MAX_BODY_BYTES);
  if (body === null) return fail(413, 'payload_too_large');
  const submission = readSubmission(parseJson(body));
  if (submission.kind === 'invalid') {
    return json(400, { ok: false, error: 'invalid_fields', fields: submission.fields });
  }
  // Bots that fill the honeypot get the same answer as people, but nothing is sent.
  if (submission.kind === 'spam') return json(200, { ok: true });
  return send(submission.message, env, new URL(request.url).hostname);
}
