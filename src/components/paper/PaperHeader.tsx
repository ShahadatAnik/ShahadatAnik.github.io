import { Brand, LanguageSwitch, ThemeToggle } from '@/components/ui'
import { langPrefix, type Lang } from '@/lib/lang'

type Props = { id: string; lang: Lang }

export function PaperHeader({ id, lang }: Props) {
  return (
    <header className="header">
      <div className="header-inner">
        <Brand href={`${langPrefix(lang)}/`} />
        <div className="header-tools">
          <LanguageSwitch lang={lang} target={{ to: '/{-$locale}/publications/$id', id }} className="paper-language" indicator />
          <ThemeToggle id="paper-theme" />
        </div>
      </div>
    </header>
  )
}
