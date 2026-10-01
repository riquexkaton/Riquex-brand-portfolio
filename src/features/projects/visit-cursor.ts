/**
 * Shows a "visit" label that follows the pointer while it is over a project link (fine pointers only).
 * The label is positioned relative to the region, so it stays aligned while the region is pinned.
 * `data-cursor-ready` lets CSS hide the native cursor only once this label can replace it.
 */
export function followVisitCursor(region: HTMLElement): void {
  const label = region.querySelector<HTMLElement>('[data-visit-cursor]');
  if (!label) return;
  region.dataset.cursorReady = '';

  region.addEventListener('pointermove', ({ target, clientX, clientY }) => {
    const overLink = target instanceof Element && target.closest('[data-visit]') !== null;
    if (overLink) {
      const rect = region.getBoundingClientRect();
      label.style.translate = `${String(clientX - rect.left)}px ${String(clientY - rect.top)}px`;
    }
    label.toggleAttribute('data-visible', overLink);
  });
  region.addEventListener('pointerleave', () => {
    label.removeAttribute('data-visible');
  });
}
