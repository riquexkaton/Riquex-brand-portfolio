import { motionEnabled, onMotionReady } from '@/motion/runtime';

import { pinCarousel } from './carousel-pin';
import { followPointer } from './cursor-parallax';
import { followVisitCursor } from './visit-cursor';

const pad = (n: number): string => String(n).padStart(2, '0');
const KEY_STEPS: Partial<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

function setupCarousel(region: HTMLElement): void {
  const scroller = region.querySelector<HTMLElement>('[data-carousel-scroller]');
  const track = region.querySelector<HTMLElement>('[data-carousel-track]');
  const status = region.querySelector('[data-carousel-status]');
  if (!scroller || !track || !status) return;

  const cards = Array.from(track.children) as HTMLElement[];
  let active = 0;
  // Base mode: native horizontal scroll-snap. The motion runtime swaps in the pinned version.
  let goTo = (index: number): void => {
    const left = (cards[index]?.offsetLeft ?? 0) - (cards[0]?.offsetLeft ?? 0);
    scroller.scrollTo({ left, behavior: motionEnabled() ? 'smooth' : 'auto' });
  };
  const step = (delta: number): void => {
    goTo(Math.min(Math.max(active + delta, 0), cards.length - 1));
  };

  // Only the active card's link is tabbable: focusing an off-screen card would scroll the pinned region.
  const link = (index: number): HTMLElement | null | undefined => cards[index]?.querySelector('[data-visit]');
  const activate = (index: number): void => {
    cards[active]?.removeAttribute('data-active');
    link(active)?.setAttribute('tabindex', '-1');
    cards[index]?.setAttribute('data-active', '');
    link(index)?.removeAttribute('tabindex');
    active = index;
    status.textContent = `${pad(index + 1)} / ${pad(cards.length)}`;
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) activate(cards.indexOf(entry.target as HTMLElement));
    },
    { root: region, threshold: 0.6 },
  );
  for (const card of cards) observer.observe(card);

  region.addEventListener('click', ({ target }) => {
    const button = target instanceof Element ? target.closest<HTMLElement>('[data-carousel-step]') : null;
    if (button) step(Number(button.dataset.carouselStep));
  });
  region.addEventListener('keydown', (event) => {
    const delta = KEY_STEPS[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    step(delta);
  });

  const finePointer = matchMedia('(pointer: fine)').matches;
  if (finePointer) followVisitCursor(region);
  if (finePointer && motionEnabled()) followPointer(region);
  onMotionReady((context) => {
    goTo = pinCarousel(context, { region, scroller, track, cards });
  });
}

const region = document.querySelector<HTMLElement>('[data-carousel]');
if (region) setupCarousel(region);
