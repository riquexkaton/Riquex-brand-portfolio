import { scramble } from './scramble';

/**
 * Marks every [data-observe] element with [data-inview] the first time it scrolls into view.
 * CSS (the `pending:` variant) owns the hidden states and transitions; this only flips the flag.
 */
export function observeReveals(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting || !(target instanceof HTMLElement)) continue;
        observer.unobserve(target);
        target.dataset.inview = '';
        if ('scramble' in target.dataset) scramble(target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  for (const element of document.querySelectorAll('[data-observe]')) observer.observe(element);
}
