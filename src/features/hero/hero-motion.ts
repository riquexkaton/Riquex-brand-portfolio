import { motionEnabled, onMotionReady } from '@/motion/runtime';

const MAGNET_X = 0.25;
const MAGNET_Y = 0.35;

/** The CTA follows the pointer (CSS transitions the `translate`). */
function magnetize(element: HTMLElement): void {
  element.addEventListener('pointermove', ({ clientX, clientY }) => {
    const rect = element.getBoundingClientRect();
    const x = (clientX - rect.left - rect.width / 2) * MAGNET_X;
    const y = (clientY - rect.top - rect.height / 2) * MAGNET_Y;
    element.style.translate = `${x}px ${y}px`;
  });
  element.addEventListener('pointerleave', () => {
    element.style.translate = '';
  });
}

const cta = document.querySelector<HTMLElement>('[data-magnetic]');
if (cta && motionEnabled() && matchMedia('(pointer: fine)').matches) magnetize(cta);

onMotionReady(({ gsap }) => {
  const section = document.querySelector('#top');
  if (!section) return;
  const scrollTrigger = { trigger: section, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('[data-hero-photo]', { yPercent: -14, ease: 'none', scrollTrigger });
  gsap.to('[data-hero-mask]', { y: () => innerHeight * 0.12, ease: 'none', scrollTrigger: { ...scrollTrigger } });
});
