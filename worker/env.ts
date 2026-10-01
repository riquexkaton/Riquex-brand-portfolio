/** Bindings and vars from wrangler.jsonc, plus the CONTACT_TO secret (`wrangler secret put CONTACT_TO`). */
export interface Env {
  ASSETS: Fetcher;
  CONTACT_EMAIL: SendEmail;
  CONTACT_LIMITER: RateLimit;
  CONTACT_FROM: string;
  CONTACT_TO: string;
}
