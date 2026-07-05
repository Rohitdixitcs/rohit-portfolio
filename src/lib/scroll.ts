/** Scrolls to an element by id, using instant scroll when the visitor has
 *  requested reduced motion instead of forcing a smooth scroll animation. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

/** Scrolls the window to the given vertical offset, respecting reduced motion. */
export function scrollWindowTo(top: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
}
