import { onMotionReady } from '@/motion/runtime';

onMotionReady(({ gsap }) => {
  const section = document.querySelector('#top');
  if (!section) return;
  const scrollTrigger = { trigger: section, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('[data-hero-photo]', { yPercent: -14, ease: 'none', scrollTrigger });
  gsap.to('[data-hero-mask]', { y: () => innerHeight * 0.12, ease: 'none', scrollTrigger: { ...scrollTrigger } });
});
