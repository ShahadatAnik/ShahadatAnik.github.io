# Homepage SEO maintenance

The public site is https://zhangzihan-is-good.github.io/.

## Generated pages

- `/`: bilingual homepage.
- `/en/` and `/zh/`: fixed English and Chinese homepages.
- `/publications/{id}/`, `/en/publications/{id}/`, and `/zh/publications/{id}/`: publication details.
- `/sitemap.xml`: canonical page URLs.
- `/robots.txt`: allows crawling and points to the sitemap.

Every page has a self canonical, reciprocal language alternatives, a descriptive title, and JSON-LD. The core text and publication links are present before JavaScript runs. JavaScript enhances filtering, modal previews, theme controls and animations.

## Updating content

The site is a TanStack Start (React, Tailwind, Bun) app that prerenders every page to static HTML in `dist/client`.

- Per-page titles, descriptions, canonical/hreflang links and JSON-LD live in `src/legacy/pages.json`; routes read them via `src/lib/pages.ts`.
- Page markup is in `src/legacy/bodies/`; profile and publication data is in `public/legacy/content.js`, translations in `public/legacy/app.js`.
- Routes are in `src/routes/`. Add new pages there and list them in the `pages` array in `vite.config.ts` so they are prerendered.

```bash
bun install
bun run dev     # local development
bun run build   # prerender to dist/client
bun run test    # game logic tests
```

Keep `public/sitemap.xml` in sync with the routes. Do not change dates merely to imply freshness.

## Search platform verification

Search Console, Bing Webmaster Tools and Baidu Search Resource Platform require the owner's authenticated account. Register the exact HTTPS homepage as the site. For Google, use a URL-prefix property and an HTML tag or verification file. Keep the issued verification tag or file after verification. Add the exact issued tag to the homepage metadata in `src/legacy/pages.json`, rebuild and publish, or publish the exact issued verification file.

Submit `https://zhangzihan-is-good.github.io/sitemap.xml` after successful ownership verification, then inspect the homepage and an example publication page. Review crawl/indexing errors and search queries in the platform dashboards.

Do not add placeholder verification tokens. Publication metadata uses existing confirmed details and short research summaries; it does not assert that full texts are hosted here or that Google Scholar has indexed the pages.

## External profile links

The Chisco and AI-breast-cancer repository READMEs link to the homepage. Google Scholar, GitHub profile website fields, and any school or laboratory profile should use the same canonical homepage when the owner can edit them.

## Hobby experiences

The four hobby cards live in `templates/homepage.html`, with translations in `app.js` and shared styling in `hobbies.css`. `hobbies.js` imports a single game or gallery when its card is opened; closing the panel disposes that experience. Game state and scores remain in memory and are never persisted. Fitness uses four falling-arrow lanes with slow, medium and fast settings; arena gameplay pauses only when requested or when the document is hidden.

Add the owner's photography to the `photographs` array in `hobbies-photos.js`, using local image files and bilingual titles/alt text. Five owner-supplied photographs currently use small ring previews and larger files loaded on opening; each keeps its original aspect ratio. See that file for the data format.

When updating homepage content only, use `--home-lastmod YYYY-MM-DD`. The existing `--lastmod` option controls publication-page dates. Bump the homepage asset version in the generator and lazy-module version in `hobbies.js` when releasing changed code. When adding photographs, also update the photos-data import version in `hobbies-gallery.js`.


## Writing collection

The writing card is in the left column of the experience section. Its technical-writing button opens `#writing-dialog`; the 44 article titles and original links are static HTML in `templates/homepage.html`, grouped by their original publication. `writing.js` adds dialog behavior and a local title filter; `writing.css` styles it. This replaces the former Feishu navigation. Update the template and regenerate all three homepages when changing the collection.

Hobby card artwork is in `assets/hobbies/`; its README records the generated asset prompts and official game-icon source. Experience accordions start collapsed in both app rendering and pre-rendered HTML.
