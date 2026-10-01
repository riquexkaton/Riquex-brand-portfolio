import { onMotionReady } from '@/motion/runtime';

// The statement's words light up as it scrolls through the viewport.
onMotionReady(({ gsap }) => {
  const statement = document.querySelector('[data-scrub]');
  if (!statement) return;
  gsap.fromTo(
    statement.querySelectorAll('[data-split-unit]'),
    { opacity: 0.16 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    },
  );
});
