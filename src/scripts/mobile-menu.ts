export function initMobileMenu(details: HTMLDetailsElement | null): void {
  if (!details) return;

  const handleScroll = (): void => {
    details.open = false;
  };

  details.addEventListener('toggle', () => {
    if (details.open) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.removeEventListener('scroll', handleScroll);
    }
  });

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
