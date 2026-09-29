enum SortOrder {
  DateDesc = 'date-desc',
  DateAsc = 'date-asc',
  TitleAsc = 'title-asc',
  TitleDesc = 'title-desc',
}

interface ArticleItem {
  el: HTMLLIElement;
  title: string;
  keywords: string;
  date: string;
}

function isSortOrder(value: string): value is SortOrder {
  return Object.values<string>(SortOrder).includes(value);
}

const comparators: Record<SortOrder, (a: ArticleItem, b: ArticleItem) => number> = {
  [SortOrder.DateDesc]: (a, b) => b.date.localeCompare(a.date),
  [SortOrder.DateAsc]: (a, b) => a.date.localeCompare(b.date),
  [SortOrder.TitleAsc]: (a, b) => a.title.localeCompare(b.title, 'ru'),
  [SortOrder.TitleDesc]: (a, b) => b.title.localeCompare(a.title, 'ru'),
};

export function initArticlesFilter(
  list: HTMLUListElement | null,
  panel: HTMLElement | null,
): void {
  if (!list || !panel) return;

  const search = panel.querySelector<HTMLInputElement>('#articles-search');
  const dateFrom = panel.querySelector<HTMLInputElement>('#articles-date-from');
  const dateTo = panel.querySelector<HTMLInputElement>('#articles-date-to');
  const sort = panel.querySelector<HTMLSelectElement>('#articles-sort');
  const count = panel.querySelector<HTMLElement>('#articles-count');
  const empty = document.getElementById('articles-empty');

  if (!search || !dateFrom || !dateTo || !sort || !count || !empty) return;

  const items: ArticleItem[] = Array.from(list.querySelectorAll('li')).map((el) => ({
    el,
    title: el.dataset.title ?? '',
    keywords: el.dataset.keywords ?? '',
    date: el.dataset.date ?? '',
  }));

  const applyFilters = (): void => {
    const query = search.value.trim().toLowerCase();
    const from = dateFrom.value;
    const to = dateTo.value;

    const visible = items.filter(({ title, keywords, date }) => {
      if (query && !title.includes(query) && !keywords.includes(query)) return false;
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    });

    const order = isSortOrder(sort.value) ? sort.value : SortOrder.DateDesc;
    visible.sort(comparators[order]);

    list.replaceChildren(...visible.map(({ el }) => el));
    count.textContent = `Найдено: ${visible.length}`;
    empty.hidden = visible.length > 0;
  };

  const resetFilters = (): void => {
    search.value = '';
    dateFrom.value = '';
    dateTo.value = '';
    sort.value = SortOrder.DateDesc;
    applyFilters();
  };

  search.addEventListener('input', applyFilters);
  dateFrom.addEventListener('input', applyFilters);
  dateTo.addEventListener('input', applyFilters);
  sort.addEventListener('change', applyFilters);

  document.querySelectorAll<HTMLButtonElement>('[data-reset-filters]').forEach((button) => {
    button.addEventListener('click', resetFilters);
  });

  panel.hidden = false;
  applyFilters();
}
