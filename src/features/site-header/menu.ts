import { onMotionReady } from '@/motion/runtime';

const root = document.querySelector<HTMLElement>('#menu-lateral');
const trigger = document.querySelector<HTMLButtonElement>('[aria-controls="menu-lateral"]');

if (root && trigger) {
  let lenis: { start: () => void; stop: () => void } | undefined;
  onMotionReady((context) => {
    lenis = context.lenis;
  });

  // Everything else on the page goes inert while the menu is open: focus stays inside the menu and
  // assistive tech only sees the menu (what a modal dialog would give natively).
  const outside = Array.from(document.body.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement && !el.contains(root),
  );

  const setOpen = (open: boolean): void => {
    root.toggleAttribute('data-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    for (const el of outside) el.inert = open;
    if (open) {
      lenis?.stop();
      root.querySelector<HTMLElement>('[data-menu-close]')?.focus();
      return;
    }
    // Restart Lenis synchronously so its anchor handler can scroll to a clicked section.
    lenis?.start();
    trigger.focus({ preventScroll: true });
  };

  trigger.addEventListener('click', () => {
    setOpen(true);
  });
  // "Cerrar", a menu link or the backdrop.
  root.addEventListener('click', ({ target }) => {
    if (target instanceof Element && target.closest('a, [data-menu-close], [data-menu-backdrop]')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.hasAttribute('data-open')) setOpen(false);
  });
}
