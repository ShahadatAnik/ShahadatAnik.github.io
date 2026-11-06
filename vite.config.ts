import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const paperIds = ['requirement-diagrams', 'rice-panicle', 'biodegradable-cnn', 'ewaste']
const pages = ['', '/kr'].flatMap((prefix) => [`${prefix}/`, ...paperIds.map((id) => `${prefix}/publications/${id}/`)])

export default defineConfig({
  server: { port: 3000 },
  // `@/` means the src folder, so imports never climb with ../../
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Fully static output so the site can stay on GitHub Pages.
      prerender: { enabled: true, crawlLinks: false, autoSubfolderIndex: true },
      pages: pages.map((path) => ({ path })),
    }),
    viteReact(),
  ],
})
