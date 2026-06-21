import * as THREE from 'three'
import { BookContent, BookDirection, createPageTexture, type ImageRect } from '@objectifthunes/three-book'
import { illustratedPageDataUrl, coverArtDataUrl, parchmentDataUrl, loadImage } from './storybook'

export interface PagesConfig {
  pageCount?: number
  pageColor?: string
  coverColor?: string
  pageW?: number
  pageH?: number
  pageLabel?: (i: number) => string
  coverLabel?: (i: number) => string
}

export interface BuiltContent {
  content: BookContent
  textures: THREE.Texture[]
}

const DEFAULT_COVERS = ['Front Cover', '', '', 'Back Cover']

/** Build a BookContent of 4 covers + N labelled pages, tracking textures for disposal. */
export function buildBookContent(cfg: PagesConfig = {}): BuiltContent {
  const {
    pageCount = 8,
    pageColor = '#f5efe0',
    coverColor = '#7b3f00',
    pageW = 2,
    pageH = 3,
  } = cfg

  const textures: THREE.Texture[] = []
  const track = (t: THREE.Texture) => { textures.push(t); return t }

  const coverW = pageW + 0.1
  const coverH = pageH + 0.1
  const content = new BookContent()
  content.direction = BookDirection.LeftToRight
  // Exactly four cover surfaces: front-outer, front-inner, back-inner, back-outer.
  const covers: (THREE.Texture | null)[] = []
  for (let i = 0; i < 4; i++) {
    const label = cfg.coverLabel ? cfg.coverLabel(i) : DEFAULT_COVERS[i]
    covers.push(track(createPageTexture(coverColor, label, null, 'contain', false, coverW, coverH)))
  }
  content.covers = covers
  // N distinct numbered pages.
  const pages: (THREE.Texture | null)[] = []
  for (let i = 0; i < pageCount; i++) {
    const label = cfg.pageLabel ? cfg.pageLabel(i) : `Page ${i + 1}`
    pages.push(track(createPageTexture(pageColor, label, null, 'contain', false, pageW, pageH)))
  }
  content.pages = pages
  return { content, textures }
}

// ── Storybook content ────────────────────────────────────────────────────────
//
// A book dressed as an illustrated storybook: a bound cover, parchment endpapers,
// and a pool of hand-drawn landscape plates cycled across the pages. Art loads
// once into module-cached HTMLImageElements; call loadStorybookArt() then rebuild.

const STORY_COVER = '#5a3b8c'
let _cover: HTMLImageElement | null = null
let _parch: HTMLImageElement | null = null
let _plates: HTMLImageElement[] = []
let _loading: Promise<void> | null = null

const PLATE_TITLES = ['The Quiet Valley', 'Over the Hills', 'The Long Road', 'Evening Falls', 'Homeward', 'A New Morning']

/** Generate + decode the storybook art once. Resolves when ready. */
export function loadStorybookArt(): Promise<void> {
  if (storybookArtReady()) return Promise.resolve()
  if (_loading) return _loading
  _loading = Promise.all([
    loadImage(coverArtDataUrl('A Storybook', STORY_COVER)),
    loadImage(parchmentDataUrl()),
    ...PLATE_TITLES.map((t, i) => loadImage(illustratedPageDataUrl(i + 1, t))),
  ]).then(([cover, parch, ...plates]) => { _cover = cover; _parch = parch; _plates = plates })
  return _loading
}

export function storybookArtReady(): boolean {
  return !!_cover && !!_parch && _plates.length > 0
}

/** Build illustrated storybook content. Falls back to labels until art loads. */
export function buildStorybookContent(pageCount = 8, pageW = 2, pageH = 3): BuiltContent {
  const textures: THREE.Texture[] = []
  const track = (t: THREE.Texture) => { textures.push(t); return t }
  const content = new BookContent()
  content.direction = BookDirection.LeftToRight
  const coverImgs = [_cover, _parch, _parch, _cover]
  content.covers = coverImgs.map((img) => track(createPageTexture(STORY_COVER, '', img, 'cover', true, pageW + 0.1, pageH + 0.1)))
  const pages: THREE.Texture[] = []
  for (let i = 0; i < pageCount; i++) {
    const img = _plates.length ? _plates[i % _plates.length] : null
    pages.push(track(createPageTexture('#efe3c6', img ? '' : `Page ${i + 1}`, img, 'cover', true, pageW, pageH)))
  }
  content.pages = pages
  return { content, textures }
}

export function pagePaperSetup(pageW = 2, pageH = 3) {
  return { width: pageW, height: pageH, thickness: 0.02, stiffness: 0.2, color: new THREE.Color(1, 1, 1), material: null as THREE.Material | null }
}

export function coverPaperSetup(pageW = 2, pageH = 3) {
  return { width: pageW + 0.1, height: pageH + 0.1, thickness: 0.04, stiffness: 0.5, color: new THREE.Color(1, 1, 1), material: null as THREE.Material | null }
}

/** A small procedural "photo" as a data URL — no bundled assets. */
export function makePatternDataUrl(w = 700, h = 500): string {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#1e3a8a'); g.addColorStop(0.5, '#9333ea'); g.addColorStop(1, '#db2777')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  for (let i = 0; i < w; i += 56) ctx.fillRect(i, 0, 22, h)
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${Math.round(h * 0.18)}px system-ui, sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('PHOTO', w / 2, h / 2)
  return c.toDataURL('image/png')
}

/**
 * createPageTexture / drawImageWithFit need a real HTMLImageElement (they read
 * naturalWidth), so a bare canvas won't draw. This loads the pattern as an
 * <img> and calls back once it's decoded.
 */
export function loadPatternImage(onReady: (img: HTMLImageElement) => void): void {
  const img = new Image()
  img.onload = () => onReady(img)
  img.src = makePatternDataUrl()
}

export type { ImageRect }
