export const SITE_NAME = 'Психолог Полина Дворецкая, Ярославль';
export const SITE_URL = 'https://polina-dvoretskaya.ru';

export const enum SocialLink {
  Telegram = 'https://t.me/polinadvoretskaia',
  Vk = 'https://vk.ru/pollinaflores',
  B17 = 'https://www.b17.ru/dvoreckaya_polina/',
  Max = 'https://max.ru/u/f9LHodD0cOJW-y67Gm_cx8avm7z4w9N3plSyjcf4PdaCskaSop2pz3R6_MQ',
  Email = 'pollinaflores@gmail.com',
}

export const PSYCHOLOGIST_NAME = 'Полина Дворецкая';
export const PSYCHOLOGIST_FULL_NAME = 'Дворецкая Полина Анатольевна';
export const CITY = 'Ярославль';
export const PRICE = '2500 ₽ / 50 минут';

export const NAV_ITEMS = [
  { href: '/#about', label: 'Обо мне' },
  { href: '/#topics', label: 'С чем работаю' },
  { href: '/#approach', label: 'Подход' },
  { href: '/#services', label: 'Консультации' },
  { href: '/#education', label: 'Образование' },
  { href: '/#faq', label: 'Вопросы' },
  { href: '/#contacts', label: 'Контакты' },
  { href: '/articles/', label: 'Статьи' },
] as const;

export function isPageLink(href: string): boolean {
  return !href.includes('#');
}
