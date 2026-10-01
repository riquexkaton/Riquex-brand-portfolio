import type { MotionContext } from '@/motion/runtime';

interface CarouselParts {
  region: HTMLElement;
  scroller: HTMLElement;
  track: HTMLElement;
  cards: HTMLElement[];
}

/**
 * Enhanced mode: pins the carousel and scrubs the track horizontally with vertical scroll,
 * snapping to each card. Returns the matching `goTo(index)` (scrolls the page via Lenis).
 */
export function pinCarousel(
  { gsap, lenis }: MotionContext,
  { region, scroller, track, cards }: CarouselParts,
): (index: number) => void {
  scroller.dataset.enhanced = '';
  scroller.scrollLeft = 0;

  const last = cards.length - 1;
  const distance = (): number => (cards[last]?.offsetLeft ?? 0) - (cards[0]?.offsetLeft ?? 0);
  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: region,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      // While pinned the region is position: fixed, out of <main>'s menu shift: it slides on its own.
      onToggle: ({ isActive }) => region.toggleAttribute('data-pinned', isActive),
      snap: { snapTo: 1 / last, duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: 'power2.inOut' },
    },
  });

  return (index) => {
    const trigger = tween.scrollTrigger;
    if (!trigger) return;
    lenis.scrollTo(trigger.start + (trigger.end - trigger.start) * (index / last), { duration: 1.1 });
  };
}
