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
