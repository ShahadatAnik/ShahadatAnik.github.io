# Site maintenance and SEO

Public site: https://shahadatanik.github.io/ (Md Shahadat Anik Sheikh).

## Generated pages

- `/` — English homepage (default).
- `/kr/` — Korean homepage.
- `/publications/{id}/` and `/kr/publications/{id}/` — one page per publication.
- `/sitemap.xml` — canonical page URLs.
- `/robots.txt` — allows crawling and points to the sitemap.

Every page has a self canonical URL, reciprocal `hreflang` alternates (`en`, `ko`, `x-default` → English), a descriptive title, and JSON-LD (Person, WebSite, ProfilePage / ScholarlyArticle). Core text and publication links are in the HTML before JavaScript runs; JavaScript only adds filtering, dialogs, theme and motion controls.

## How the site is built

TanStack Start (React, Tailwind, Bun) prerenders every page to static HTML in `dist/client`.

```bash
bun install
bun run dev -- --force   # local development (http://localhost:3000)
bun run typecheck        # TypeScript check
bun run build            # prerender to dist/client
```

Run only one dev server at a time. Two servers on port 3000 make the browser mix them up and break React ("Invalid hook call").

## Where content lives

**Almost everything you want to change is in one typed file: `src/site.config.ts`.** It holds your name, email and links (GitHub, LinkedIn, Scholar), the site URL and Google verification token, hero text, affiliations, SEO title/description, education, honors, experience, skills, research areas and publications. Every visible text is `{ en: '…', ko: '…' }` (Korean falls back to English if `ko` is omitted), and TypeScript checks the fields (`bun run typecheck`). BibTeX is generated from the publication fields.

| What | File |
| --- | --- |
| All your info (see above) | `src/site.config.ts` |
| Generic UI wording (buttons, section headings) in English and Korean | `src/data/i18n.ts` |
| Pages to prerender (`paperIds`) | `vite.config.ts` |
| Sitemap and robots | `public/sitemap.xml`, `public/robots.txt` |
| Favicon and portrait | `public/assets/favicon.svg`, `public/assets/portrait.jpg` |
| Adapter from config to components, and SEO / JSON-LD builders (normally untouched) | `src/data/content.ts`, `src/data/seo.ts` |

The second language is Korean (`ko`), served at `/kr/`. Switching language is a client-side navigation, so the page does not reload.

### Adding or removing a publication

1. Add or delete the entry in `publications` in `src/site.config.ts` (unique `id`, `summary` with `en`/`ko`).
2. Add or remove the `id` in `paperIds` in `vite.config.ts`.
3. Add or remove its `/publications/{id}/` and `/kr/publications/{id}/` lines in `public/sitemap.xml`.
4. Run `bun run typecheck` and `bun run build`.

Keep `public/sitemap.xml` in sync with the routes. Do not change dates just to imply freshness.

## Search platform verification

Search Console and Bing Webmaster Tools need the owner's own account.

1. Register `https://shahadatanik.github.io/` as a URL-prefix property.
2. Choose the HTML tag method and copy the exact issued tag content.
3. Put it in `site.googleVerification` in `src/site.config.ts` (currently empty, so no tag is emitted), rebuild and publish. Keep the tag after verification.
4. Submit `https://shahadatanik.github.io/sitemap.xml`, then inspect the homepage and one publication page.

Never add placeholder verification tokens.

## Open items

- Full co-author lists for the rice panicle and biodegradable-waste papers (Scholar truncates them) — update `authors` in `src/site.config.ts`.
- CV PDF download button (add the file under `public/assets/` and a link in the hero).
- Research-area counts show 0 for Brain-AI & BCI and Multimodal learning until papers are tagged with those topics.
- Korean wording has not been reviewed by a native speaker.
- Not deployed yet: publish `dist/client` to the `ShahadatAnik.github.io` repository.
## Link previews (when someone shares the site)

Every page ships Open Graph and Twitter/X card tags, so a shared link shows a large 1200×630 preview with your photo, name, headline and Kyung Hee University.

- English pages use `public/assets/og-image.png`; Korean pages (`/kr/`) use `public/assets/og-image-kr.png`. Paper pages use the same image as the home page.
- Titles and descriptions come from `seo` in `src/site.config.ts`. Keep the title under about 65 characters and the description under about 160 so previews are not cut off.
- Phones use `public/assets/icon-512.png` as the home-screen icon.
- To change the preview (new photo, headline or affiliation), edit `scripts/og/og.html`, then run `bun scripts/make-og-image.mjs`. It needs Chrome (set the `CHROME` environment variable if it is not in the default place) and writes the PNGs into `public/assets/`.
- Social sites cache previews. After deploying, refresh them with the LinkedIn Post Inspector (linkedin.com/post-inspector), the Facebook Sharing Debugger (developers.facebook.com/tools/debug), and by posting the link once on X. Messaging apps (WhatsApp, Telegram, Slack) refresh on their own after a while.

Also on every page: canonical URL, `hreflang` (en, ko, x-default), `robots` with large image previews allowed, `author`, keywords, and structured data (Person with LinkedIn, GitHub and Scholar in `sameAs`, plus the universities you attended).

## Google Analytics 4

Put your measurement ID (looks like `G-XXXXXXXXXX`, from Analytics > Admin > Data streams > your web stream) in `site.analyticsId` in `src/site.config.ts`. While it is empty nothing is tracked. The tag is added to every page, and only in the production build, so `bun run dev` never sends data. English/Korean switches and paper pages are counted through GA4's built-in history-change tracking.

Visitors from the EU may need a cookie consent banner for Google Analytics. Add one before promoting the site there.

## Photo gallery

The auto-scrolling gallery sits below "Research and engineering". Add photos in `gallery` in `src/site.config.ts`, one entry each:

```ts
{
  image: '/assets/gallery/my-photo.jpg',        // file in public/assets/gallery/, landscape 4:3 (about 1200x900), under ~300 KB
  event: { en: 'Conference talk', ko: '학회 발표' },
  description: { en: 'One or two sentences: what it was and your part in it.', ko: '…' },
  date: '2026-05',                              // 'YYYY-MM' or 'YYYY-MM-DD'
  place: { en: 'Seoul, South Korea', ko: '대한민국 서울' },   // optional
  alt: { en: 'Short description for screen readers', ko: '…' },  // optional, defaults to the event name
  url: 'https://…',                             // optional: makes the whole card a link
}
```

The five cards with `sample: true` are placeholders and show a "Sample" badge. Delete them (and the `sample-*.svg` files) when you add real photos. Newest first reads best. It scrolls on its own, pauses on hover or keyboard focus, and becomes a swipeable row for visitors who prefer reduced motion. With no entries the section disappears.

## Speed

Measured with Lighthouse (mobile, simulated slow 4G, 4x slower CPU): home page 99, paper pages 100, desktop 100; first paint about 1.7 s on mobile, 0.4 s on desktop; nothing blocks the main thread. What keeps it fast:

- **Pages are prerendered HTML**, so text and layout show before any JavaScript runs.
- **Fonts are served from this site** (`public/assets/fonts/`, latin only, preloaded). There is no Google Fonts request. Korean text uses the visitor's own Korean system font, so `/kr` downloads no font either.
- **No animation library.** The scroll bar, header and portrait tilt are a few lines of plain code. Do not add `framer-motion` back; it was about 50 KB of the page's JavaScript.
- **Images are small:** the portrait is a 520 px WebP (about 13 KB) and the Kyung Hee logo a 152 px WebP. Keep new photos under about 300 KB. The `.jpg`/`.png` originals stay in `public/` for the link-preview images and structured data.
- **Google Analytics is off** until you set an ID; when on it loads after the page.

To re-measure: `bun run build`, serve `dist/client`, then run Lighthouse on it. Re-check after adding the photo gallery (use `loading="lazy"` and keep each image small).
