type Level = 'near' | 'max' | undefined;

function levelOf(length: number, max: number, near: number): Level {
  if (length >= max) return 'max';
  if (length >= near) return 'near';
  return undefined;
}

/**
 * Updates the field's "length/max" counter, if it has one. `data-level` drives its colour: `near`
 * from the counter's `data-near` threshold on, `max` at the field's maxlength.
 */
export function renderCounter(control: HTMLInputElement | HTMLTextAreaElement, length = control.value.length): void {
  const counter = document.getElementById(`${control.id}-counter`);
  if (!counter) return;
  counter.textContent = `${length}/${control.maxLength}`;
  const level = levelOf(length, control.maxLength, Number(counter.dataset.near ?? Infinity));
  if (level) counter.dataset.level = level;
  else delete counter.dataset.level;
}
