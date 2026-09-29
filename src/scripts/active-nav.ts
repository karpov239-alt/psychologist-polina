const DESKTOP_ACTIVE_CLASSES = ['text-pine-500', 'font-medium', 'underline', 'underline-offset-4'];
const MOBILE_ACTIVE_CLASSES = ['bg-pine-50', 'font-medium'];

function isMobileLink(link: HTMLElement): boolean {
  return link.closest('details') !== null;
}

function activeClassesFor(link: HTMLElement): string[] {
  return isMobileLink(link) ? MOBILE_ACTIVE_CLASSES : DESKTOP_ACTIVE_CLASSES;
}

export function initActiveNav(): void {
  if (document.documentElement.hasAttribute('data-active-nav-init')) return;
  document.documentElement.setAttribute('data-active-nav-init', '');

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-nav-target]'));
  if (links.length === 0) return;

  const setActive = (href: string | null): void => {
    for (const link of links) {
      const isActive = href !== null && link.dataset['navTarget'] === href;
      link.classList.remove(...activeClassesFor(link));
      link.removeAttribute('aria-current');
      if (isActive) {
        link.classList.add(...activeClassesFor(link));
        link.setAttribute('aria-current', href.includes('#') ? 'location' : 'page');
      }
    }
  };

  const path = window.location.pathname;

  if (path.startsWith('/articles')) {
    setActive('/articles/');
    return;
  }

  if (path !== '/' && path !== '/index.html') return;

  for (const link of links) {
    const href = link.dataset['navTarget'];
    if (href?.includes('#')) {
      link.addEventListener('click', () => setActive(href));
    }
  }

  const sectionByHref = new Map<string, HTMLElement>();
  for (const link of links) {
    const href = link.dataset['navTarget'];
    const hash = href?.startsWith('/#') ? href.slice(2) : null;
    if (hash) {
      const section = document.getElementById(hash);
      if (section) sectionByHref.set(href as string, section);
    }
  }
  if (sectionByHref.size === 0) return;

  const visible = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        for (const [href, section] of sectionByHref) {
          if (section === entry.target) {
            if (entry.isIntersecting) {
              visible.add(href);
            } else {
              visible.delete(href);
            }
          }
        }
      }
      setActive(visible.size > 0 ? (visible.values().next().value as string) : null);
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  for (const section of sectionByHref.values()) {
    observer.observe(section);
  }
}
