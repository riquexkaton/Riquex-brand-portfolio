/**
 * Cards drift against the pointer: the region exposes the pointer offset (-0.5…0.5) as
 * --px/--py and each card's CSS `translate` scales it by its --depth (transitioned in CSS).
 */
export function followPointer(region: HTMLElement): void {
  region.addEventListener('pointermove', ({ clientX, clientY }) => {
    const rect = region.getBoundingClientRect();
    region.style.setProperty('--px', String((clientX - rect.left) / rect.width - 0.5));
    region.style.setProperty('--py', String((clientY - rect.top) / rect.height - 0.5));
  });
  region.addEventListener('pointerleave', () => {
    region.style.removeProperty('--px');
    region.style.removeProperty('--py');
  });
}
