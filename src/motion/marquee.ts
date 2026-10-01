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
    for (const { track, speed } of marquees) {
      track.style.animationDuration = `${track.scrollWidth / 2 / (speed * FPS)}s`;
    }
  });
  for (const { track } of marquees) observer.observe(track);
}

/** Scroll velocity speeds the marquees up; scrolling up flips their direction. */
function reactToScroll(marquees: Marquee[]): void {
  onMotionReady(({ gsap, lenis }) => {
    const animations = marquees.flatMap(({ track }) => track.getAnimations());
    let direction = 1;
    let lastRate = 1;
    gsap.ticker.add(() => {
      const { velocity } = lenis;
      if (Math.abs(velocity) > 0.2) direction = Math.sign(velocity);
      const rate = direction * (1 + Math.min(Math.abs(velocity), MAX_VELOCITY) * VELOCITY_GAIN);
      if (Math.abs(rate - lastRate) < 0.01) return;
      lastRate = rate;
      for (const animation of animations) animation.playbackRate = rate;
    });
  });
}

export function initMarquees(): void {
  const marquees = findMarquees();
  syncDurations(marquees);
  reactToScroll(marquees);
}
