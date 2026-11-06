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

| What | File |
| --- | --- |
| Name, email, GitHub / LinkedIn / Scholar links | `src/data/content.ts` → `profile` |
| Publications, education, honors, experience, skills, research areas | `src/data/content.ts` |
| Korean text for the entries above (looked up by exact English string) | `src/data/ko.ts` |
| UI strings (nav, headings, buttons, bio) in English and Korean | `src/data/i18n.ts` |
| Titles, descriptions, canonical / hreflang links, JSON-LD, site URL | `src/data/seo.ts` |
| Routes (`/`, `/kr/`, publication pages) | `src/routes/` |
| Pages to prerender | `pages` / `paperIds` in `vite.config.ts` |
| Sitemap and robots | `public/sitemap.xml`, `public/robots.txt` |
| Favicon | `public/assets/favicon.svg` |
| Portrait | `public/assets/portrait.jpg` |

The Korean language is stored under the internal key `zh` (the second language slot). It holds Korean text and is served at `/kr/`.

### Adding or removing a publication

1. Add or delete the entry in `publications` in `src/data/content.ts` (unique `id`, English `summary`, `bibtex`).
2. Add Korean text for any new `b("…")` string in `src/data/ko.ts`.
3. Add or remove the `id` in `paperIds` in `vite.config.ts`.
4. Add or remove its `/publications/{id}/` and `/kr/publications/{id}/` lines in `public/sitemap.xml`.
5. Run `bun run typecheck` and `bun run build`.

Keep `public/sitemap.xml` in sync with the routes. Do not change dates just to imply freshness.

## Search platform verification

Search Console and Bing Webmaster Tools need the owner's own account.

1. Register `https://shahadatanik.github.io/` as a URL-prefix property.
2. Choose the HTML tag method and copy the exact issued tag content.
3. Put it in `GOOGLE_VERIFICATION` in `src/data/seo.ts` (currently empty, so no tag is emitted), rebuild and publish. Keep the tag after verification.
4. Submit `https://shahadatanik.github.io/sitemap.xml`, then inspect the homepage and one publication page.

Never add placeholder verification tokens.

## Open items

- Full co-author lists for the rice panicle and biodegradable-waste papers (Scholar truncates them) — update `authors` and `bibtex`.
- CV PDF download button (add the file under `public/assets/` and a link in the hero).
- Research-area counts show 0 for Brain-AI & BCI and Multimodal learning until papers are tagged with those topics.
- Korean wording has not been reviewed by a native speaker.
- Not deployed yet: publish `dist/client` to the `ShahadatAnik.github.io` repository.
