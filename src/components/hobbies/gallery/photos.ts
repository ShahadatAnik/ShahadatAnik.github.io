/**
 * Personal photographs supplied by Zihan.
 * Small display copies power the ring; larger copies load only on opening.
 * Image files have no location or camera metadata.
 */
export interface Bilingual {
  en: string
  zh: string
}

export interface Photograph {
  src: string
  fullSrc: string
  width: number
  height: number
  title: Bilingual
  alt: Bilingual
  caption?: Bilingual
}

export const photographs: readonly Photograph[] = [
  {
    src: '/assets/photos/coastal-portrait-preview.webp',
    fullSrc: '/assets/photos/coastal-portrait-large.webp',
    width: 888, height: 1600,
    title: { en: 'By the blue water', zh: '碧水之畔' },
    alt: { en: 'A woman beside a wooden railing, with turquoise water and mountains behind her.', zh: '木栏旁的人像，身后是碧蓝的水面和山峦。' },
  },
  {
    src: '/assets/photos/quiet-cat-preview.webp',
    fullSrc: '/assets/photos/quiet-cat-large.webp',
    width: 1600, height: 1200,
    title: { en: 'Little win', zh: '小win' },
    alt: { en: 'A round-eyed tabby cat resting on a bed.', zh: '一只圆眼睛的虎斑猫安静地趴在床上。' },
  },
  {
    src: '/assets/photos/sunset-preview.webp',
    fullSrc: '/assets/photos/sunset-large.webp',
    width: 1600, height: 1200,
    title: { en: 'Evening in the city', zh: '城市暮色' },
    alt: { en: 'Golden sunset clouds above a street and the silhouettes of city buildings.', zh: '金色晚霞映在街道与城市建筑的剪影上。' },
  },
  {
    src: '/assets/photos/seaside-preview.webp',
    fullSrc: '/assets/photos/seaside-large.webp',
    width: 1600, height: 1200,
    title: { en: 'Along the coast', zh: '海岸漫步' },
    alt: { en: 'A man beside a seaside boardwalk, with flowers and blue water in the background.', zh: '海滨木栈道旁的人像，背景是花丛与蓝色海面。' },
  },
  {
    src: '/assets/photos/stained-glass-preview.webp',
    fullSrc: '/assets/photos/stained-glass-large.webp',
    width: 1600, height: 1067,
    title: { en: 'Sagrada Família', zh: '圣家堂' },
    alt: { en: 'Warm light through tall stained-glass windows, framed by columns and a visitor’s silhouette.', zh: '暖光透过高大的彩色玻璃窗，立柱与参观者的剪影在前景交错。' },
  },
]
