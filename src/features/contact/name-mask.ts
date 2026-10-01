const DISALLOWED = /[^\p{L}\p{M}\s'.-]+/gu;
const SPACES = /\s+/gu;
const LEADING = /^[\s'.-]+/u;

/** Letters, combining marks, single spaces, apostrophes, dots and hyphens; never a separator first. */
const clean = (text: string): string =>
  text.normalize('NFC').replace(DISALLOWED, '').replace(SPACES, ' ').replace(LEADING, '');

/**
 * Masks a name as it's typed or pasted, capped at `max` characters. The caret keeps its place in
 * the text: it moves left by whatever the mask removed before it, instead of jumping to the end.
 */
export function maskName(value: string, caret: number, max: number): { value: string; caret: number } {
  const masked = clean(value).slice(0, max);
  return { value: masked, caret: Math.min(clean(value.slice(0, caret)).length, masked.length) };
}
