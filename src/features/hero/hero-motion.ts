import { onMotionReady } from '@/motion/runtime';

// One trigger drives both layers: each tween spans the whole timeline, so both follow its progress.
onMotionReady(({ gsap }) => {
  const section = document.querySelector('#top');
  if (!section) return;
  gsap
    .timeline({ scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true } })
    .to('[data-hero-photo]', { yPercent: -14, ease: 'none' }, 0)
    .to('[data-hero-mask]', { y: () => innerHeight * 0.12, ease: 'none' }, 0);
});
