/** Context handed to each lazily-loaded hobby experience when it opens. */
export interface HobbyContext {
  /** 'en' | 'zh' | 'both' (the page language preference at open time). */
  language: string
  reducedMotion: boolean
}

export type HobbyId = 'cube' | 'fitness' | 'gallery' | 'arena'
