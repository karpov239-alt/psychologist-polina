import type { BreadcrumbItem } from '../types/breadcrumbs';

export enum SegmentLabel {
  articles = 'Статьи',
}

export function buildBreadcrumbs(pathname: string, currentLabel?: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [];

  const items: BreadcrumbItem[] = [{ label: 'Главная', href: '/' }];
  let path = '';

  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label =
      SegmentLabel[segment as keyof typeof SegmentLabel] ??
      (isLast && currentLabel ? currentLabel : segment);
    items.push(isLast ? { label } : { label, href: `${path}/` });
  });

  return items;
}
