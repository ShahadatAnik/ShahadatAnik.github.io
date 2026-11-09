/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import appCss from '@/styles.css?url'
import { langFromPath } from '@/lib/lang'
import { analyticsScripts } from '@/data/seo'

// Runs before first paint. Theme: the saved choice, otherwise the system setting (light or dark). Motion: the saved
// choice or the system's reduced-motion setting. Language: a returning visitor who chose Korean and opens the bare
// home address (/) is taken to /kr/. Links that name a language (/kr/...) are never redirected.
const THEME_INIT = `try{var d=document.documentElement,s=localStorage.getItem("zz-theme");d.dataset.theme=s==="light"||s==="dark"?s:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.dataset.motionPaused=String(localStorage.getItem("zz-motion-paused")==="true"||matchMedia("(prefers-reduced-motion:reduce)").matches);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d.dataset.theme==="dark"?"#1c211e":"#f7f7f2");if(location.pathname==="/"&&localStorage.getItem("zz-language")==="ko")location.replace("/kr/"+location.search+location.hash)}catch(e){}`

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width,initial-scale=1' }, { name: 'theme-color', content: '#f7f7f2' }],
    links: [
      { rel: 'icon', href: '/assets/favicon.svg?v=2', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/assets/icon-512.png' },
      { rel: 'stylesheet', href: appCss },
    ],
    scripts: [{ children: THEME_INIT }, ...analyticsScripts()],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeContent: 'center', gap: 12, textAlign: 'center', padding: 24 }}>
      <h1>Page not found</h1>
      <p>That page doesn’t exist.</p>
      <a href="/" style={{ textDecoration: 'underline' }}>Back to home</a>
    </main>
  )
}

function RootDocument() {
  const { pathname } = useLocation()
  const lang = langFromPath(pathname)
  return (
    <html
      lang={lang === 'ko' ? 'ko' : 'en'}
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
