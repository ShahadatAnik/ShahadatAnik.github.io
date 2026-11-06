// Prerendering fetches pages over localhost; local ad-blocking proxies can inject <script> tags into that
// traffic. Strip any such third-party injections so the published HTML only contains our own markup.
import fs from 'node:fs/promises'
import path from 'node:path'

async function* walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else if (p.endsWith('.html')) yield p
  }
}

let cleaned = 0
for await (const file of walk(new URL('../dist/client', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
  const html = await fs.readFile(file, 'utf8')
  const out = html.replace(/<script[^>]*src="\/\/local\.adguard\.org[^"]*"[^>]*><\/script>/g, '')
  if (out !== html) { await fs.writeFile(file, out); cleaned++ }
}
console.log(`clean-dist: sanitized ${cleaned} file(s)`)
