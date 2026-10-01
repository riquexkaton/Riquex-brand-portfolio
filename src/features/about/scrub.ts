import { onMotionReady } from '@/motion/runtime';

// Dimmed state: paper over black at .4 is ~3.2:1, above WCAG's 3:1 for large text (the statement
// is at least 28px). The design's .16 (1.37:1) failed color-contrast.
const DIMMED = 0.4;

// The statement's words light up as it scrolls through the viewport.
onMotionReady(({ gsap }) => {
  const statement = document.querySelector('[data-scrub]');
  if (!statement) return;
  gsap.fromTo(
    statement.querySelectorAll('[data-split-unit]'),
    { opacity: DIMMED },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    },
  );
});
