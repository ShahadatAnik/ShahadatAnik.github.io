import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const paperIds = ['brain-survey', 'chisco', 'cofett', 'gist', 'leem', 'masters-thesis', 'multibcd']
const pages = ['/', '/en/', '/zh/'].concat(
  ['', '/en', '/zh'].flatMap((prefix) => paperIds.map((id) => `${prefix}/publications/${id}/`)),
)

export default defineConfig({
  server: { port: 3000 },
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
