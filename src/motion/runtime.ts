import type { gsap as Gsap } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

export interface MotionContext {
  gsap: typeof Gsap;
  ScrollTrigger: typeof ScrollTriggerType;
  lenis: Lenis;
}

type MotionCallback = (context: MotionContext) => void;

const queue: MotionCallback[] = [];
let context: MotionContext | undefined;

/** True when <html class="motion"> was set by the head script (JS on, no reduced motion). */
export const motionEnabled = (): boolean => document.documentElement.classList.contains('motion');

/** Registers an enhancement that runs once GSAP, ScrollTrigger and Lenis are loaded. */
export function onMotionReady(callback: MotionCallback): void {
  if (context) callback(context);
  else queue.push(callback);
}

/**
 * Re-measures every trigger when the page height changes on its own (a <details> row opening, late
 * fonts or images), so the pin keeps its start and end. Heights a full refresh already measured are
 * skipped: the observer's initial notification and ScrollTrigger's own refreshes (window resizes,
 * pin spacing). A forced refresh also cancels ScrollTrigger's pending resize refresh, so a window
 * resize still refreshes once.
 */
function refreshOnHeightChange(ScrollTrigger: typeof ScrollTriggerType): void {
  const { body } = document;
  const measure = (): number => body.getBoundingClientRect().height;
  let measuredHeight = measure();
  ScrollTrigger.addEventListener('refresh', () => {
    measuredHeight = measure();
  });
  let timer = 0;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (measure() !== measuredHeight) ScrollTrigger.refresh();
    }, 200);
  }).observe(body);
}

/** Gives the main thread back (to paint, handle input) and resumes ahead of other queued tasks. */
function yieldToMain(): Promise<void> {
  if ('scheduler' in window && 'yield' in scheduler) return scheduler.yield();
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

async function load(): Promise<void> {
  const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('lenis'),
  ]);
  // Startup runs as short tasks: module evaluation, setup, then one task per enhancement.
  await yieldToMain();
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ anchors: { duration: 1.3 }, lerp: 0.08, wheelMultiplier: 0.9, touchMultiplier: 1.2 });
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const ready: MotionContext = { gsap, ScrollTrigger, lenis };
  // In page order. No explicit refresh: each trigger measures itself when created (top to bottom, so
  // nothing above the pin moves) and creating the pin queues one full refresh for the next frame.
  for (let callback = queue.shift(); callback; callback = queue.shift()) {
    await yieldToMain();
    callback(ready);
  }
  context = ready;
  refreshOnHeightChange(ScrollTrigger);
}

/** Lazily loads the motion libraries after `load` and an idle period. Call only when motionEnabled(). */
export function startMotion(): void {
  const schedule = (): void => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => void load(), { timeout: 2000 });
    else setTimeout(() => void load(), 200);
  };
  if (document.readyState === 'complete') schedule();
  else addEventListener('load', schedule, { once: true });
}
