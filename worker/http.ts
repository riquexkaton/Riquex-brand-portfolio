// Worker responses don't get public/_headers (it only applies to static assets), so they set their own.
const BASE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export function json(status: number, body: object, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...BASE_HEADERS, ...headers } });
}

export const fail = (status: number, error: string, headers?: Record<string, string>): Response =>
  json(status, { ok: false, error }, headers);

/** Reads the body as UTF-8 text. Returns null as soon as it grows past maxBytes, without buffering the rest. */
export async function readText(request: Request, maxBytes: number): Promise<string | null> {
  if (Number(request.headers.get('Content-Length')) > maxBytes) return null;
  if (!request.body) return '';
  const reader = (request.body as ReadableStream<Uint8Array>).getReader();
  const decoder = new TextDecoder();
  let text = '';
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return text + decoder.decode();
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
}
