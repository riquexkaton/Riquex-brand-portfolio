const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/—';
const DURATION_MS = 900;

const randomGlyph = (): string => GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/** Decodes an element's text from random glyphs back to its final value (already in the HTML). */
export function scramble(element: HTMLElement): void {
  const final = element.textContent;
  const start = performance.now();

  const frame = (now: number): void => {
    const progress = Math.min((now - start) / DURATION_MS, 1);
    const settled = Math.floor(easeOutCubic(progress) * final.length);
    element.textContent = final.slice(0, settled) + final.slice(settled).replace(/\S/g, randomGlyph);
    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}
