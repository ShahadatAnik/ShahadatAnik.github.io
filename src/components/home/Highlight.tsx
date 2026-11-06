import type { ReactNode } from 'react'

/** Wraps case-insensitive matches of `query` in <mark>. */
export function Highlight({ text, query }: { text: string | number; query: string }) {
  const value = String(text ?? '')
  if (!query) return <>{value}</>
  const lower = value.toLowerCase()
  const target = query.toLowerCase()
  const parts: ReactNode[] = []
  let cursor = 0
  let at = lower.indexOf(target, cursor)
  while (at !== -1) {
    if (at > cursor) parts.push(value.slice(cursor, at))
    parts.push(<mark key={at}>{value.slice(at, at + query.length)}</mark>)
    cursor = at + query.length
    at = lower.indexOf(target, cursor)
  }
  parts.push(value.slice(cursor))
  return <>{parts}</>
}
