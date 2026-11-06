import { useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { writingCollections } from '../../data/writing'
import { Dual } from '../Dual'
import '../../styles/writing.css'

type Language = 'en' | 'zh' | 'both'

const TRIGGER_SELECTOR = '#open-writing'

function readLanguage(): Language {
  const value = document.documentElement.dataset.language
  return value === 'en' || value === 'zh' ? value : 'both'
}

function setTriggerExpanded(expanded: boolean) {
  document.querySelector(TRIGGER_SELECTOR)?.setAttribute('aria-expanded', String(expanded))
}

export function WritingDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const savedOverflow = useRef('')
  const ownsScrollLock = useRef(false)
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState<Language>('both')

  const needle = query.trim().toLocaleLowerCase()
  const collections = useMemo(
    () =>
      writingCollections
        .map((c) => ({
          ...c,
          visible: c.articles
            .map((article, index) => ({ article, number: index + 1 }))
            .filter(({ article }) => !needle || article.title.toLocaleLowerCase().includes(needle)),
        }))
        .filter((c) => c.visible.length > 0),
    [needle],
  )
  const total = collections.reduce((sum, c) => sum + c.visible.length, 0)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const releaseLock = () => {
      if (ownsScrollLock.current) {
        document.body.style.overflow = savedOverflow.current
        ownsScrollLock.current = false
      }
    }
    const open = () => {
      if (dialog.open || document.querySelector('dialog[open]')) return
      setQuery('')
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      savedOverflow.current = document.body.style.overflow
      ownsScrollLock.current = true
      document.body.style.overflow = 'hidden'
      setTriggerExpanded(true)
      if (scrollRef.current) scrollRef.current.scrollTop = 0
      dialog.scrollTop = 0
      closeRef.current?.focus({ preventScroll: true })
    }
    const finishClose = () => {
      releaseLock()
      setTriggerExpanded(false)
      const target = returnFocus.current
      returnFocus.current = null
      if (document.visibilityState !== 'hidden' && target?.isConnected) target.focus({ preventScroll: true })
    }
    const onPageHide = () => {
      if (dialog.open) dialog.close()
      finishClose()
    }
    const onHash = () => {
      if (window.location.hash === '#writing') open()
    }

    setLanguage(readLanguage())
    const observer = new MutationObserver(() => setLanguage(readLanguage()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] })

    window.addEventListener('open-writing', open)
    window.addEventListener('hashchange', onHash)
    window.addEventListener('pagehide', onPageHide)
    dialog.addEventListener('close', finishClose)
    onHash()

    return () => {
      observer.disconnect()
      window.removeEventListener('open-writing', open)
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('pagehide', onPageHide)
      dialog.removeEventListener('close', finishClose)
      if (dialog.open) dialog.close()
      releaseLock()
    }
  }, [])

  const labelledBy =
    language === 'zh' ? 'writing-title-zh' : language === 'en' ? 'writing-title-en' : 'writing-title-en writing-title-zh'
  const placeholder =
    language === 'zh' ? '输入标题关键词' : language === 'en' ? 'Search article titles' : 'Search titles / 搜索文章标题'

  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current
    if (!dialog || event.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      dialog.close()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      id="writing-dialog"
      aria-labelledby={labelledBy}
      aria-describedby="writing-dialog-intro"
      onClick={onBackdropClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
          event.preventDefault()
          dialogRef.current?.close()
        }
      }}
    >
      <header className="writing-dialog-header">
        <div>
          <span className="eyebrow">WRITING &amp; SHARING</span>
          <h2 className="writing-dialog-title">
            <span className="en" lang="en" id="writing-title-en">Selected writing</span>
            <span className="zh" lang="zh-CN" id="writing-title-zh">技术文章</span>
          </h2>
          <p className="writing-dialog-intro" id="writing-dialog-intro">
            <Dual en="Zicy · Technology writing" zh="笔名 Zicy · 技术写作" />
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          data-writing-close
          aria-label="Close writing / 关闭技术文章"
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
      </header>
      <div className="writing-dialog-tools">
        <label className="writing-search">
          <span className="sr-only">
            <Dual en="Find an article" zh="搜索文章" />
          </span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            type="search"
            data-writing-search
            placeholder={placeholder}
            autoComplete="off"
            aria-controls="writing-collections"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="writing-result-count" role="status" aria-live="polite" aria-atomic="true">
          <strong data-writing-count>{String(total).padStart(2, '0')}</strong>
          <Dual en="articles" zh="篇文章" />
        </div>
      </div>
      <div className="writing-dialog-scroll" id="writing-collections" ref={scrollRef}>
        {collections.map((collection) => (
          <section key={collection.id} className="writing-collection" aria-labelledby={collection.id}>
            <header className="writing-collection-heading">
              <h3 id={collection.id} lang="zh-CN">{collection.title}</h3>
              <span aria-hidden="true">{collection.articles.length}</span>
            </header>
            <ol className="writing-articles">
              {collection.visible.map(({ article, number }) => (
                <li key={article.url} className="writing-article">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <span className="writing-article-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
                    <span className="writing-article-copy">
                      <span className="writing-article-title" lang="zh-CN">{article.title}</span>
                      <span className="writing-article-source">{article.source}</span>
                    </span>
                    <span className="writing-article-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
        <p className="writing-empty" data-writing-empty hidden={total > 0}>
          <Dual en="No matching articles." zh="没有找到匹配的文章。" />
        </p>
      </div>
    </dialog>
  )
}
