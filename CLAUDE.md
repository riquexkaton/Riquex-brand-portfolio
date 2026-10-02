# riquex-portfolio-landing

Personal portfolio landing for Enrique Urdaneta. Astro 7 (static) + Tailwind v4, deployed to Cloudflare Workers static assets (`wrangler.jsonc`) at https://enriqueurdaneta.dev (Custom Domain; workers.dev is disabled).
Design source: Claude Design project `def95714-e0eb-457b-b852-19254fe47a59` (`Portfolio.dc.html`).

## Commands

- `pnpm dev` — dev server (use it to verify UI changes). If newly added Tailwind classes don't apply, restart it: the Tailwind Vite plugin can serve stale CSS after many edits (dev-only; builds are unaffected).
- `pnpm verify` — typecheck + lint + file size + dead code (same gates as pre-commit)
- `pnpm typecheck` (`astro check` + `tsc -p worker`) · `pnpm lint` · `pnpm check:size` · `pnpm knip` · `pnpm format`
- `pnpm run deploy:cf` — build + `wrangler deploy` (needs `pnpm dlx wrangler@4 login` once). Always `pnpm run`: plain `pnpm deploy` is pnpm's built-in workspace command.
- `pnpm dlx wrangler@4 dev` — serves an existing `dist/` plus the `/api/*` Worker locally (don't build just for this). Needs `.dev.vars` (copy `.dev.vars.example`). `send_email` is simulated: the message lands in `.wrangler/tmp/email/`. Test with curl and `-H "Origin: http://127.0.0.1:8787"`.

## Non-negotiable rules

1. **Never build to verify.** Use `pnpm typecheck`, `pnpm lint` or the dev server. Only build for deploys or Lighthouse runs.
2. **Never bypass the gates.** No `--no-verify`, no `eslint-disable` for architecture/size rules, no raising limits to make a file pass — split the file instead.
3. **Max 200 lines per file** (any extension, CSS included). Limits live in `quality.config.js`, shared by ESLint and `scripts/check-file-size.js`. Functions ≤ 60 lines, complexity ≤ 8, depth ≤ 3, params ≤ 3.
4. **Tailwind first.** Use variants before custom CSS (`starting:`, `details-content:`, `motion:`, `pending:`, `has-[…]`). Custom CSS only when Tailwind can't express it (`@custom-variant`, `@utility`, keyframes in `@theme`, base rules), and only in `src/styles/global.css`.
5. **No dead code.** `knip` must stay clean: no unused files, exports or dependencies.

## Architecture (enforced by eslint-plugin-boundaries)

```
src/pages     → composition only            may import: layouts, features
src/layouts   → html shell, head, SEO       may import: ui, data, motion, styles, assets
src/features/<section> → one folder per page section (markup + its client scripts)
                                             may import: ui, data, motion, assets, same feature only
src/ui        → presentational, props only  may import: ui
src/data      → typed content only          may import: assets, data (type-only)
src/motion    → client motion runtime       may import: motion
```

- A feature never imports another feature. Shared pieces go to `ui/` (presentational) or `data/` (content).
- Pages can't import data: page-specific content goes through a feature (e.g. `features/not-found` for the 404).
- In `<script>` blocks, import with `./` or `@/` only (`../` is banned because boundaries can't resolve it there).
- `gsap` and `lenis` are imported **only** inside `src/motion/`. Features register enhancements through the motion runtime (`onMotionReady`).
- Every file under `src/` must belong to one of these layers.
- `worker/` (outside `src/` and its layers) is the Cloudflare Worker behind `/api/*`: `assets.run_worker_first` sends only those paths to it, everything else stays a static asset with `public/_headers`. It has its own `tsconfig.json` (Workers runtime types, no DOM) and never imports from `src/`; the field limits and honeypot name it shares with the form are mirrored in `src/data/contact.ts`.

## Performance rules (Lighthouse)

- **Above-the-fold content must paint without JS.** Never start the hero (or anything visible on load) at `opacity: 0` or hidden behind a script. Intro effects are CSS; the hero portrait is revealed by a CSS curtain over an already-painted image.
- Motion libraries load lazily (dynamic `import()` after load + idle) and never under `prefers-reduced-motion`.
- Hidden initial states for reveals apply only under the `html.motion` class set by the inline head script. No-JS and reduced-motion users see everything. Elements opt in with `data-observe`; the observer in `motion/reveal.ts` sets `data-inview` once.
- Text splitting happens at build time (`ui/SplitChars.astro`), not with SplitText.
- **Zero third-party requests at runtime:** fonts via the Astro Fonts API (self-hosted), icons as inline SVG from `simple-icons` at build time, images via `astro:assets` `<Picture>` (AVIF + WebP). The one exception is Cloudflare Web Analytics: the edge injects its beacon into the HTML that browsers get (it's not in the repo or in local builds), and the CSP allows `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (connect) for it.
- Interactive patterns go native first: `<details name>` for the accordion, CSS `:has()` for hover states. The side menu is a visibility-toggled panel, not a modal `<dialog>` (its display toggling broke the open/close transitions); `menu.ts` makes the rest of the page `inert`.
- While the menu is open the page slides left (`menu-shift` utility + `menu-open` variant). It animates `left`, never a transform on `main`/`footer`: a transformed ancestor breaks the fixed ScrollTrigger pin. The pinned carousel (`data-pinned`) slides with `translate` instead.
- `:has()` in custom variants: keep the element as the subject (`html:has(…) &`), never `&:where(html:has(…) *)`. The `*` form makes Chrome restyle the whole page on every DOM insertion or removal, and ScrollTrigger inserts nodes on every refresh (this was most of the desktop TBT).
- Motion startup yields to the main thread between `onMotionReady` callbacks (`runtime.ts`); keep each callback short and don't add an explicit `ScrollTrigger.refresh()` after them (the pin schedules one).
- Scroll locking must not change the page width: `<html>` keeps `scrollbar-gutter: stable`. Otherwise the page jumps when the scrollbar disappears and the body `ResizeObserver` fires `ScrollTrigger.refresh()` mid-animation.
- Reveal overlays (e.g. the hero curtain) sit outside the clipping box they cover and overhang it by 1px; inside the same clip, anti-aliased edges leak thin lines of the content below.
- The Claude browser pane often reports `document.hidden`: compositor animations don't render in its screenshots. Verify motion with measurements (`getAnimations()`, computed styles), not screenshots.

## Conventions

- Code, identifiers and comments: English. UI copy: Spanish, matching the design.
- `compressHTML: 'jsx'` drops whitespace between elements on separate lines. When inline elements must wrap or be separated (lists of words, links), emit the space explicitly with `{' '}`, and keep it outside any `whitespace-nowrap` element.
- Type-checked lint applies to `.ts` files only; `.astro` files and their `<script>` blocks use `disableTypeChecked` (the virtual TSX gives false positives). a11y lint: `eslint-plugin-jsx-a11y-x` (the original plugin doesn't support ESLint 10).
- Content lives in `src/data/*` (`as const satisfies`), never hardcoded in features.
- **CSP** (`security.csp` in `astro.config.ts`, emitted as a `<meta>`; dev mode doesn't apply it, test with build + preview): Astro hashes every bundled script and `<style>`, but not `is:inline` scripts. Hash those with `Astro.csp.insertScriptHash` from the exact emitted text (see `BaseLayout`). Trusted Types are enforced: never use `innerHTML`/`insertAdjacentHTML`, set text with `textContent`. Inline `style` attributes are allowed (`style-src-attr`).
- TypeScript is pinned to `~6.0`: `typescript-eslint` (<6.1) and `@astrojs/check` (^5 || ^6) don't support TS 7 yet. Don't upgrade until both do.
- Node ≥ 24 (`.nvmrc`). `eslint-plugin-astro` 3.x declares node ^24.16.
- Conventional commits, no AI attribution.

## Email

- Cloudflare Email Routing on `enriqueurdaneta.dev` forwards `enrique@` (the public address in `site.email`) to the owner's inbox, which never appears in the repo or the site.
- The form sends from `contacto@` (`CONTACT_FROM`) to the `CONTACT_TO` runtime secret (dashboard → Worker → Settings → Variables and Secrets, or `pnpm dlx wrangler@4 secret put CONTACT_TO`). Without it `/api/contact` answers 500 and the form shows its error state.
