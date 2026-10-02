import { onMotionReady } from './runtime';

const FPS = 60;
const MAX_VELOCITY = 40;
const VELOCITY_GAIN = 0.12;

interface Marquee {
  track: HTMLElement;
  speed: number;
}

function findMarquees(): Marquee[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-marquee]'), (root) => ({
    track: root.firstElementChild as HTMLElement,
    speed: Number(root.dataset.speed),
  }));
}

/** Matches the design speed (px per frame at 60 fps) whatever the track width is. */
function syncDurations(marquees: Marquee[]): void {
  const observer = new ResizeObserver(() => {
    // All reads first, then all writes: one layout instead of one per marquee.
    const durations = marquees.map(({ track, speed }) => [track, track.scrollWidth / 2 / (speed * FPS)] as const);
    for (const [track, duration] of durations) track.style.animationDuration = `${duration}s`;
  });
  for (const { track } of marquees) observer.observe(track);
}

/** Scroll velocity speeds the marquees up; scrolling up flips their direction. */
function reactToScroll(marquees: Marquee[]): void {
  onMotionReady(({ gsap, lenis }) => {
    let animations: Animation[] | undefined;
    let direction = 1;
    let lastRate = 1;
    gsap.ticker.add(() => {
      const { velocity } = lenis;
      if (Math.abs(velocity) > 0.2) direction = Math.sign(velocity);
      const rate = direction * (1 + Math.min(Math.abs(velocity), MAX_VELOCITY) * VELOCITY_GAIN);
      if (Math.abs(rate - lastRate) < 0.01) return;
      lastRate = rate;
      // Looked up on the first scroll: getAnimations() flushes styles, which startup doesn't need.
      animations ??= marquees.flatMap(({ track }) => track.getAnimations());
      for (const animation of animations) animation.playbackRate = rate;
    });
  });
}

export function initMarquees(): void {
  const marquees = findMarquees();
  syncDurations(marquees);
  reactToScroll(marquees);
}
