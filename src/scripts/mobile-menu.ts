export function initMobileMenu(details: HTMLDetailsElement | null): void {
  if (!details) return;

  document.addEventListener('click', (event: MouseEvent) => {
    if (details.open && event.target instanceof Node && !details.contains(event.target)) {
      details.open = false;
    }
  });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && details.open) {
      details.open = false;
    }
  });

  details.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => {
      details.open = false;
    });
  });
}
