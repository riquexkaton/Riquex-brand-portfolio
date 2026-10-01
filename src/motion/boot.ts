import { initMarquees } from './marquee';
import { observeReveals } from './reveal';
import { motionEnabled, startMotion } from './runtime';

if (motionEnabled()) {
  observeReveals();
  initMarquees();
  startMotion();
}
