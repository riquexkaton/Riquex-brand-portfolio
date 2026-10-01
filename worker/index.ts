// Runs only for /api/* (assets.run_worker_first in wrangler.jsonc); every other path is a static asset.
import { handleContact } from './contact';
import type { Env } from './env';
import { fail } from './http';

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    if (pathname.startsWith('/api/')) return fail(404, 'not_found');
    // Defensive: if run_worker_first ever widens, non-API paths still get the static site.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
