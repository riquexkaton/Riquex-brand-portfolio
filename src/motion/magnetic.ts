const PULL_X = 0.25;
const PULL_Y = 0.35;

function magnetize(element: HTMLElement): void {
  element.addEventListener('pointermove', ({ clientX, clientY }) => {
    const rect = element.getBoundingClientRect();
    const x = (clientX - rect.left - rect.width / 2) * PULL_X;
    const y = (clientY - rect.top - rect.height / 2) * PULL_Y;
    element.style.translate = `${x}px ${y}px`;
  });
  element.addEventListener('pointerleave', () => {
    element.style.translate = '';
  });
}

/** `[data-magnetic]` elements follow a fine pointer (their `cta` utility transitions the `translate`). */
export function initMagnetic(): void {
  if (!matchMedia('(pointer: fine)').matches) return;
  for (const element of document.querySelectorAll<HTMLElement>('[data-magnetic]')) magnetize(element);
}
