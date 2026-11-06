import { createContext, useContext } from 'react'
import type { Lang } from '../../lib/lang'

/** The page language, provided once per page (home or paper). */
export const LangContext = createContext<Lang>('en')
export const useLang = () => useContext(LangContext)
