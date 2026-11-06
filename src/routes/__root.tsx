/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { langFromPath } from '../lib/lang'

// Applies the saved theme / motion preference before first paint (same logic as the original site).
const THEME_INIT = `try{document.documentElement.dataset.theme=localStorage.getItem("zz-theme")||"dark";document.documentElement.dataset.motionPaused=String(localStorage.getItem("zz-motion-paused")==="true"||matchMedia("(prefers-reduced-motion:reduce)").matches)}catch(e){}`

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width,initial-scale=1' }, { name: 'theme-color', content: '#f7f7f2' }],
    links: [
      { rel: 'icon', href: '/assets/favicon.svg', type: 'image/svg+xml' },
      { rel: 'stylesheet', href: appCss },
    ],
    scripts: [{ children: THEME_INIT }],
  }),
  component: RootDocument,
})

function RootDocument() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  return (
    <html
      lang={lang === 'zh' ? 'zh-CN' : 'en'}
      data-language={lang}
      data-route-language={lang}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className={pathname.includes('/publications/') ? 'paper-page' : undefined}>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
