'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Book,
  BookContent,
  BookDirection,
  StapleBookBinding,
  SpreadContent,
  TextOverlayContent,
  createPageTexture,
  PX_PER_UNIT,
  AutoTurnSettings,
  AutoTurnDirection,
} from '@objectifthunes/three-book'
import { useBookStage } from './useBookStage'
import { LiveStage } from './LiveStage'
import { LiveRow, LiveButton, LiveSlider, LiveToggle, LiveSwatch, LiveReadout } from './controls'
import { buildBookContent, pagePaperSetup, coverPaperSetup, loadPatternImage } from './book-content'

const PAGE_W = 2
const PAGE_H = 3
const PCW = Math.round(PAGE_W * PX_PER_UNIT)
const PCH = Math.round(PAGE_H * PX_PER_UNIT)
const COVER_COLOR = '#7b3f00'
const PAGE_COLOR = '#f5efe0'

/** Jump the book to show `pageIndex` as the right-hand page once it's built. */
function makeOpenToPage(pageIndex: number) {
  let done = false
  return (book: Book) => {
    if (!done && book.isBuilt) {
      // page side index = coverPaperCount + pageIndex; the fold there shows it on the right.
      book.setOpenProgressByIndex(book.coverPaperCount + pageIndex)
      done = true
    }
  }
}

/** Four cover surfaces built from scratch (never pushed onto the default nulls). */
function makeCovers(track: (t: THREE.Texture) => THREE.Texture): THREE.Texture[] {
  const labels = ['Front Cover', '', '', 'Back Cover']
  return labels.map((label) => track(createPageTexture(COVER_COLOR, label, null, 'contain', false, PAGE_W + 0.1, PAGE_H + 0.1)))
}

/** Shared BookOptions — the library's real defaults: closed, flat on the ground. */
function baseOptions(extra?: Partial<ConstructorParameters<typeof Book>[0]>) {
  return {
    binding: new StapleBookBinding(),
    initialOpenProgress: 0,
    castShadows: true,
    alignToGround: true,
    pagePaperSetup: pagePaperSetup(PAGE_W, PAGE_H),
    coverPaperSetup: coverPaperSetup(PAGE_W, PAGE_H),
    ...extra,
  }
}

/** A draggable book, opened to its first page. */
export function LiveBook({
  pageCount = 8,
  hint = 'Drag a page to turn it · drag the background to orbit',
}: { pageCount?: number; hint?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount, pageColor: PAGE_COLOR, coverColor: COVER_COLOR })
      const book = new Book({ content, ...baseOptions() })
      const open = makeOpenToPage(0)
      return { book, onFrame: () => open(book), cleanup: () => textures.forEach((t) => t.dispose()) }
    },
    deps: [pageCount],
  })
  return <LiveStage ref={ref} hint={hint} />
}

/** Programmatic page turns via book.startAutoTurning(). */
export function LiveAutoTurn() {
  const ref = useRef<HTMLDivElement>(null)
  const settings = useMemo(() => new AutoTurnSettings(), [])
  const { bookRef } = useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount: 10, pageColor: PAGE_COLOR, coverColor: COVER_COLOR })
      const book = new Book({ content, ...baseOptions() })
      const open = makeOpenToPage(0)
      return { book, onFrame: () => open(book), cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  const turn = (dir: AutoTurnDirection, count = 1) => bookRef.current?.startAutoTurning(dir, settings, count)
  return (
    <LiveStage
      ref={ref}
      hint="Each button calls book.startAutoTurning(direction, settings, count)"
      controls={
        <LiveRow>
          <LiveButton onClick={() => turn(AutoTurnDirection.Next, 1)}>Next ▸</LiveButton>
          <LiveButton onClick={() => turn(AutoTurnDirection.Back, 1)}>◂ Prev</LiveButton>
          <LiveButton onClick={() => turn(AutoTurnDirection.Next, 99)}>Flip to end</LiveButton>
          <LiveButton onClick={() => turn(AutoTurnDirection.Back, 99)}>Back to start</LiveButton>
        </LiveRow>
      }
    />
  )
}

/** Instant jumps with book.setOpenProgress(t) — slider sweeps the whole book. */
export function LiveOpenProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(0)
  const { bookRef } = useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount: 8, pageColor: PAGE_COLOR, coverColor: COVER_COLOR })
      const book = new Book({ content, ...baseOptions() })
      return { book, cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  const onChange = (val: number) => { setV(val); bookRef.current?.setOpenProgress(val) }
  return (
    <LiveStage
      ref={ref}
      hint="The slider calls book.setOpenProgress(t) — 0 is closed, 1 is fully open"
      controls={<LiveSlider label="openProgress" min={0} max={1} step={0.01} value={v} onChange={onChange} format={(x) => x.toFixed(2)} />}
    />
  )
}

/** Read-only state, polled each frame off the live book. */
export function LiveBookState() {
  const ref = useRef<HTMLDivElement>(null)
  const { bookRef } = useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount: 8, pageColor: PAGE_COLOR, coverColor: COVER_COLOR })
      const book = new Book({ content, ...baseOptions() })
      const open = makeOpenToPage(0)
      return { book, onFrame: () => open(book), cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  const [s, setS] = useState({ turning: false, falling: false, idle: true, progress: 0, papers: 0 })
  useEffect(() => {
    const id = setInterval(() => {
      const b = bookRef.current
      if (b) setS({ turning: b.isTurning, falling: b.isFalling, idle: b.isIdle, progress: b.openProgress, papers: b.paperCount })
    }, 100)
    return () => clearInterval(id)
  }, [bookRef])
  return (
    <LiveStage
      ref={ref}
      hint="Drag a page — these getters are read off the book every frame"
      controls={
        <LiveRow>
          <LiveReadout label="isTurning" value={String(s.turning)} />
          <LiveReadout label="isFalling" value={String(s.falling)} />
          <LiveReadout label="isIdle" value={String(s.idle)} />
          <LiveReadout label="openProgress" value={s.progress.toFixed(2)} />
          <LiveReadout label="paperCount" value={s.papers} />
        </LiveRow>
      }
    />
  )
}

/** A live geometry playground — rebuilds the book (not the renderer) on change. */
export function LiveGeometry() {
  const ref = useRef<HTMLDivElement>(null)
  const params = useRef({ pageCount: 8, thickness: 0.02, stiffness: 0.2, pageColor: PAGE_COLOR, coverColor: COVER_COLOR })
  const [, force] = useState(0)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const p = params.current
      const { content, textures } = buildBookContent({ pageCount: p.pageCount, pageColor: p.pageColor, coverColor: p.coverColor })
      const book = new Book({
        content,
        ...baseOptions({ pagePaperSetup: { ...pagePaperSetup(PAGE_W, PAGE_H), thickness: p.thickness, stiffness: p.stiffness } }),
      })
      const open = makeOpenToPage(0)
      return { book, onFrame: () => open(book), cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  const set = <K extends keyof typeof params.current>(k: K, val: (typeof params.current)[K]) => {
    params.current = { ...params.current, [k]: val }
    force((n) => n + 1)
    rebuild()
  }
  const p = params.current
  return (
    <LiveStage
      ref={ref}
      tall
      hint="Every control rebuilds the Book with new BookOptions — drag a page to feel the change"
      controls={
        <>
          <LiveRow>
            <LiveSlider label="pages" min={2} max={20} step={2} value={p.pageCount} onChange={(v) => set('pageCount', v)} />
            <LiveSlider label="thickness" min={0.008} max={0.05} step={0.002} value={p.thickness} onChange={(v) => set('thickness', v)} format={(x) => x.toFixed(3)} />
            <LiveSlider label="stiffness" min={0.05} max={0.9} step={0.05} value={p.stiffness} onChange={(v) => set('stiffness', v)} format={(x) => x.toFixed(2)} />
          </LiveRow>
          <LiveRow>
            <LiveSwatch label="page" value={p.pageColor} onChange={(v) => set('pageColor', v)} />
            <LiveSwatch label="cover" value={p.coverColor} onChange={(v) => set('coverColor', v)} />
          </LiveRow>
        </>
      }
    />
  )
}

/** Show / hide the staple binder. */
export function LiveBinding() {
  const ref = useRef<HTMLDivElement>(null)
  const hide = useRef(false)
  const [, force] = useState(0)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount: 8, pageColor: PAGE_COLOR, coverColor: COVER_COLOR })
      const book = new Book({ content, ...baseOptions({ hideBinder: hide.current }) })
      const open = makeOpenToPage(0)
      return { book, onFrame: () => open(book), cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  return (
    <LiveStage
      ref={ref}
      hint="StapleBookBinding draws the staples down the spine; hideBinder removes the mesh"
      controls={
        <LiveToggle
          label="hideBinder"
          checked={hide.current}
          onChange={(v) => { hide.current = v; force((n) => n + 1); rebuild() }}
        />
      }
    />
  )
}

/** Load the pattern image once, then rebuild so it draws. */
function usePatternImage(rebuild: () => void) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  useEffect(() => {
    let alive = true
    loadPatternImage((im) => { if (alive) { imgRef.current = im; rebuild() } })
    return () => { alive = false }
  }, [rebuild])
  return imgRef
}

/** An image on page 1 with the three fit modes. */
export function LiveTextures() {
  const ref = useRef<HTMLDivElement>(null)
  const cfg = useRef<{ fit: 'contain' | 'cover' | 'fill'; fullBleed: boolean }>({ fit: 'cover', fullBleed: true })
  const [, force] = useState(0)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const textures: THREE.Texture[] = []
      const track = (t: THREE.Texture) => { textures.push(t); return t }
      const content = new BookContent()
      content.direction = BookDirection.LeftToRight
      content.covers = makeCovers(track)
      const pages: THREE.Texture[] = []
      pages.push(track(createPageTexture(PAGE_COLOR, '', imgRef.current, cfg.current.fit, cfg.current.fullBleed, PAGE_W, PAGE_H)))
      for (let i = 1; i < 8; i++) pages.push(track(createPageTexture(PAGE_COLOR, `Page ${i + 1}`, null, 'contain', false, PAGE_W, PAGE_H)))
      content.pages = pages
      const book = new Book({ content, ...baseOptions() })
      const open = makeOpenToPage(0)
      return { book, onFrame: () => open(book), cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  const imgRef = usePatternImage(rebuild)
  const setFit = (f: 'contain' | 'cover' | 'fill') => { cfg.current = { ...cfg.current, fit: f }; force((n) => n + 1); rebuild() }
  return (
    <LiveStage
      ref={ref}
      hint="createPageTexture draws the image onto page 1 with the chosen fit mode"
      controls={
        <LiveRow>
          {(['contain', 'cover', 'fill'] as const).map((f) => (
            <LiveButton key={f} active={cfg.current.fit === f} onClick={() => setFit(f)}>{f}</LiveButton>
          ))}
          <LiveToggle label="fullBleed" checked={cfg.current.fullBleed} onChange={(v) => { cfg.current = { ...cfg.current, fullBleed: v }; force((n) => n + 1); rebuild() }} />
        </LiveRow>
      }
    />
  )
}

/** Styled text overlaid on page 1 with TextOverlayContent. */
export function LiveTextOverlay() {
  const ref = useRef<HTMLDivElement>(null)
  const text = useRef('Chapter One')
  const [, force] = useState(0)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const textures: THREE.Texture[] = []
      const track = (t: THREE.Texture) => { textures.push(t); return t }
      const content = new BookContent()
      content.direction = BookDirection.LeftToRight
      content.covers = makeCovers(track)
      const base = track(createPageTexture(PAGE_COLOR, '', null, 'contain', false, PAGE_W, PAGE_H))
      const overlay = new TextOverlayContent({ width: PCW, height: PCH, source: (base as THREE.CanvasTexture).image as HTMLCanvasElement })
      overlay.addText({ text: text.current, x: 60, y: 150, width: 392, fontSize: 44, fontFamily: 'Georgia', fontStyle: 'italic', color: '#1a1a1a', textAlign: 'center', shadowColor: 'rgba(0,0,0,0.25)', shadowBlur: 6 })
      const pages: (THREE.Texture | TextOverlayContent)[] = [overlay]
      for (let i = 1; i < 8; i++) pages.push(track(createPageTexture(PAGE_COLOR, `Page ${i + 1}`, null, 'contain', false, PAGE_W, PAGE_H)))
      content.pages = pages
      const book = new Book({ content, ...baseOptions() })
      const open = makeOpenToPage(0)
      return {
        book,
        onFrame: () => { overlay.update(book); open(book) },
        cleanup: () => { overlay.dispose(); textures.forEach((t) => t.dispose()) },
      }
    },
  })
  const pick = (t: string) => { text.current = t; force((n) => n + 1); rebuild() }
  return (
    <LiveStage
      ref={ref}
      hint="A TextOverlayContent composites a styled TextBlock onto page 1"
      controls={
        <LiveRow>
          {['Chapter One', 'Once upon a time', 'The End'].map((t) => (
            <LiveButton key={t} active={text.current === t} onClick={() => pick(t)}>{t}</LiveButton>
          ))}
        </LiveRow>
      }
    />
  )
}

/** A double-page spread — one image across the two facing pages 2–3. */
export function LiveSpread() {
  const ref = useRef<HTMLDivElement>(null)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const textures: THREE.Texture[] = []
      const track = (t: THREE.Texture) => { textures.push(t); return t }
      const content = new BookContent()
      content.direction = BookDirection.LeftToRight
      content.covers = makeCovers(track)

      // page 0 normal; pages 1–2 are one spread (odd start index); rest normal.
      const wide = track(createPageTexture('#0b1020', '', imgRef.current, 'cover', true, PAGE_W * 2, PAGE_H))
      const spread = new SpreadContent({ pageWidth: PCW, pageHeight: PCH })
      spread.source = (wide as THREE.CanvasTexture).image as HTMLCanvasElement
      spread.addText({ text: 'One image, two pages', x: 120, y: 90, width: 780, fontSize: 54, fontFamily: 'Georgia', color: '#ffffff', textAlign: 'center' })
      spread.markDirty()

      const pages: (THREE.Texture | object)[] = []
      pages.push(track(createPageTexture(PAGE_COLOR, 'Page 1', null, 'contain', false, PAGE_W, PAGE_H)))
      pages.push(spread.left)
      pages.push(spread.right)
      for (let i = 3; i < 8; i++) pages.push(track(createPageTexture(PAGE_COLOR, `Page ${i + 1}`, null, 'contain', false, PAGE_W, PAGE_H)))
      content.pages = pages as THREE.Texture[]

      const book = new Book({ content, ...baseOptions() })
      const open = makeOpenToPage(2) // show pages 1–2 (the spread) as the facing pair
      return {
        book,
        onFrame: () => { spread.update(book); open(book) },
        cleanup: () => { spread.dispose(); textures.forEach((t) => t.dispose()) },
      }
    },
  })
  const imgRef = usePatternImage(rebuild)
  return <LiveStage ref={ref} hint="A SpreadContent puts one image across the two facing pages — drag to leaf through" />
}
