import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import type { Lang } from '../../lib/lang'
import { writeClipboard } from './hooks'

export const pick = (lang: Lang, en: string, zh: string) => (lang === 'zh' ? zh : lang === 'en' ? en : `${en} / ${zh}`)

type Props = {
  lang: Lang
  getText: () => string
  onResult: (message: string) => void
  children: ReactNode
}

/** Copies text to the clipboard, flashes a "Copied" state, and reports through the toast. */
export function CopyButton({ lang, getText, onResult, children }: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const ok = await writeClipboard(getText())
    if (!ok) {
      onResult(pick(lang, 'Copy unavailable. Select the citation text.', '无法自动复制，请手动选择引用文本。'))
      return
    }
    button.focus({ preventScroll: true })
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1900)
    onResult(pick(lang, 'Copied to clipboard', '已复制到剪贴板'))
  }

  return (
    <button className={copied ? 'paper-copy is-copied' : 'paper-copy'} type="button" onClick={onClick}>
      {copied ? `✓ ${pick(lang, 'Copied', '已复制')}` : children}
    </button>
  )
}
