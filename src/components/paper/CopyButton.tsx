import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import type { Lang } from '../../lib/lang'
import { writeClipboard } from './hooks'

export const pick = (lang: Lang, en: string, ko: string) => (lang === 'ko' ? ko : lang === 'en' ? en : `${en} / ${ko}`)

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
      onResult(pick(lang, 'Copy unavailable. Select the citation text.', '자동 복사가 되지 않습니다. 인용 텍스트를 직접 선택하세요.'))
      return
    }
    button.focus({ preventScroll: true })
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1900)
    onResult(pick(lang, 'Copied to clipboard', '클립보드에 복사했습니다'))
  }

  return (
    <button className={copied ? 'paper-copy is-copied' : 'paper-copy'} type="button" onClick={onClick}>
      {copied ? `✓ ${pick(lang, 'Copied', '복사됨')}` : children}
    </button>
  )
}
