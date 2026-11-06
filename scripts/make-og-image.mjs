// Renders the link-preview images (1200x630) from scripts/og/og.html with headless Chrome.
//   bun scripts/make-og-image.mjs
// Output: public/assets/og-image.png (English) and public/assets/og-image-kr.png (Korean).
// Set CHROME to the browser path if it is not the default Windows location.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const chrome =
  process.env.CHROME ||
  ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync)
if (!chrome) throw new Error('Chrome not found. Set the CHROME environment variable.')

const template = pathToFileURL(path.join(root, 'scripts/og/og.html')).href
for (const [lang, file] of [['en', 'og-image.png'], ['ko', 'og-image-kr.png']]) {
  const out = path.join(root, 'public/assets', file)
  const result = spawnSync(
    chrome,
    ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--window-size=1200,630', '--virtual-time-budget=9000', `--screenshot=${out}`, `${template}?lang=${lang}`],
    { stdio: 'ignore' },
  )
  console.log(lang, result.status === 0 ? `-> ${out}` : 'failed')
}

// Home-screen icon (512px, full-bleed square: phones round the corners themselves).
const icon = pathToFileURL(path.join(root, 'scripts/og/icon.html')).href
for (const size of [512]) {
  const out = path.join(root, `public/assets/icon-${size}.png`)
  const result = spawnSync(
    chrome,
    ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${size},${size}`, '--virtual-time-budget=3000', `--screenshot=${out}`, icon],
    { stdio: 'ignore' },
  )
  console.log(`icon-${size}`, result.status === 0 ? `-> ${out}` : 'failed')
}
