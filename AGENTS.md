# AGENTS.md

Инструкции для AI-агентов, работающих с этим репозиторием.

## Контекст проекта

Персональный сайт практикующего психолога **Дворецкой Полины Анатольевны** (Ярославль).

- Продакшн-домен: https://polina-dvoretskaya.ru
- Репозиторий: https://github.com/karpov239-alt/psychologist-polina
- Хостинг: GitHub Pages (статика из `dist/`)
- Профиль на b17.ru: https://www.b17.ru/dvoreckaya_polina/

**Главная цель сайта — SEO.** Максимальная видимость в Яндексе и Google по локальным запросам («психолог Ярославль», «семейный психолог Ярославль», «детский психолог Ярославль») и информационным запросам («как справиться с тревогой», «панические атаки», «детско-родительские отношения»).

Любое техническое решение оценивай с точки зрения: **помогает ли это SEO и скорости?**

## Стек

- Astro (static output, без SSR-адаптеров)
- TypeScript, strict mode — **обязательно**
- Tailwind CSS для стилей
- Content Collections для статей
- Деплой: GitHub Pages через GitHub Actions (.github\workflows\deploy.yaml)
- Используй Enum для перечислений констант из одной смысловой группы

## Жёсткие правила

### TypeScript

- **Только TypeScript. Никакого JavaScript.**
- Все `.astro`-компоненты с frontmatter на TS.
- Для каждого компонента — `interface Props` с явными типами (если есть props у компонента).
- Общие типы — в `src/types/`.
- `any` запрещён. Если очень нужно — `unknown` + type guard.
- `tsconfig.json` наследует `astro/tsconfigs/strict`.
- Используй path aliases: `@components/*`, `@layouts/*`, `@utils/*`, `@types/*`.

### SEO (приоритет №1)

- Каждая страница **обязана** использовать компонент `<SEO />` с уникальными `title` (до 60 символов) и `description` (до 160 символов).
- Title-шаблон: `{Заголовок} | Психолог Полина Дворецкая, Ярославль`.
- Всегда проставляй `<link rel="canonical">`.
- Для главной и контактов — JSON-LD `Psychologist` / `LocalBusiness` (schema.org).
- Для статей — JSON-LD `Article` с `author`, `datePublished`, `headline`.
- Изображения — через `astro:assets`, формат WebP/AVIF, обязательный `alt`.
- Не добавляй клиентский JS без необходимости. Zero JS by default.
- Внутренняя перелинковка: каждая статья ссылается минимум на 1 другую статью и на 1 страницу услуг.

### Контент
 
- Язык сайта: **русский** (`lang="ru"`).
- Тексты — тёплые, человечные, без канцелярита и без «психотерапевтического жаргона».
- В текстах естественно упоминать «Ярославль» и «онлайн» (гео + формат работы).
- Статьи лежат в `src/content/articles/*.md` (или `.mdx`).
- У каждой статьи в frontmatter: `title`, `description`, `publishedAt`, `updatedAt?`, `cover?`, `tags[]`, `keywords[]`, `draft`.
- Черновики (`draft: true`) не попадают в прод-сборку и sitemap.

### Запрещено

- Коммерческое использование кода, дизайна и текстов без письменного разрешения правообладателя (README.md). Не предлагай решения, которые нарушают это.
- Медицинские диагнозы, обещания «вылечить», гарантии результата.
- Любые упоминания конкретных препаратов и дозировок.
- Хранение API-ключей и секретов в репозитории.

### Юридическое (важно для психолога)

- В футере — дисклеймер: «Сайт не является медицинским сервисом. Консультации не заменяют медицинскую помощь».
- При темах суицида, самоповреждения, насилия — статьи должны содержать блок с телефонами доверия (РФ: 8-800-2000-122, 8-495-989-50-50 и т.п.).
- Формулировки «помогу справиться», «поддержка», а не «вылечу», «гарантирую».

## Разработка

При запуске dev-сервера используй фоновый режим:

```bash
astro dev --background
```

Управление: `astro dev stop`, `astro dev status`, `astro dev logs`.

Перед коммитом:

```bash
npm run check    # astro check + tsc
npm run build    # проверка, что сборка проходит
```

## Структура

```
src/
  components/   → UI-компоненты (.astro)
  content/
    articles/   → статьи (.md), коллекция `articles`
  layouts/      → Layout
  pages/        → роуты; статьи — pages/articles/ (список + [...id].astro)
  styles/       → global.css (включая стили `.article-content` для текста статей)
  types/        → общие TS-интерфейсы
  utils/        → хелперы (site.ts, date.ts, faq.ts)
content.config.ts → схема коллекции `articles` (title, description, publishedAt, updatedAt?, cover?, tags[], keywords[], draft)
public/         → CNAME, .nojekyll, favicon, og-image, robots.txt
```

Не меняй структуру `src/pages/` без явного запроса — от неё зависят URL и SEO.

## Конвенции кода

- Имена компонентов: PascalCase (`ArticleCard.astro`).
- Имена страниц: kebab-case (`about-me.astro`, `services.astro`).
- URL — только латиница, kebab-case, без транслита вперемешку.
- Комментарии — только там, где неочевидно. Не комментируй очевидное.
- Никаких `console.log` в проде.

## Деплой

- Пуш в `main` → GitHub Actions → сборка → публикация на GitHub Pages.
- `public/CNAME` содержит `polina-dvoretskaya.ru` — не трогай без спроса.
- `public/.nojekyll` — не удаляй.
- GitHub Pages Source должен быть **GitHub Actions**, не «Deploy from branch».

## Документация Astro

Проект использует актуальную мажорную версию Astro (7+). Перед работой с версионно-специфичными API (config, integrations, content collections, adapter, assets) — **сверяйся с официальной документацией**, а не полагайся на память:

- [Upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)

Если API, который ты помнишь, не совпадает с текущей докой — **верь доке**, и явно сообщи пользователю, что паттерн устарел.

## Чек-лист перед PR

- [ ] Все новые файлы — TypeScript
- [ ] `interface Props` у каждого нового компонента (если у компонента есть props)
- [ ] `<SEO />` на каждой новой странице
- [ ] Уникальные title/description
- [ ] `npm run check` проходит
- [ ] `npm run build` проходит
- [ ] Нет `any`, нет `console.log`
- [ ] Нет секретов в коде