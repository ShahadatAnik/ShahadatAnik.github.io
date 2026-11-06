import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Dual } from '../Dual'
import { localized } from '../../data/i18n'
import { copyText, useToast } from '../../hooks/useToast'
import { useLang } from './shared'

interface CopyButtonProps {
  text: string
  /** Toast shown on success (already localized). */
  message: string
  className?: string
  id?: string
  ariaLabel?: string
  children: ReactNode
}

/** Copies `text`, flashes a "Copied" state on the button and raises a toast. */
export function CopyButton({ text, message, className, id, ariaLabel, children }: CopyButtonProps) {
  const lang = useLang()
  const toast = useToast()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = async () => {
    const ok = await copyText(text)
    if (ok) {
      clearTimeout(timer.current)
      setCopied(true)
      timer.current = setTimeout(() => setCopied(false), 1900)
    }
    toast.show(ok ? message : localized(lang, 'Copy unavailable. Select the text in the overview.', '자동 복사가 되지 않습니다. 개요에서 텍스트를 직접 선택하세요.'))
  }

  return (
    <button
      type="button"
      id={id}
      className={[className, copied ? 'is-copied' : ''].filter(Boolean).join(' ') || undefined}
      aria-label={copied ? localized(lang, 'Copied', '복사됨') : ariaLabel}
      onClick={onClick}
    >
      {copied ? (
        <>
          <span aria-hidden="true">✓</span>
          <span><Dual en="Copied" zh="복사됨" /></span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
