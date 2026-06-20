'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Book,
  BookContent,
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

/** Jump the book to a specific paper-side index once it's built. */
function makeOpenToIndex(sideIndex: number) {
  let done = false
  return (book: Book) => {
    if (!done && book.isBuilt) {
      book.setOpenProgressByIndex(sideIndex)
      done = true
    }
  }
}

/** Open a book past its front cover (plus `extra` page turns) once built and idle. */
function makeAutoOpen(extra = 0) {
  const settings = new AutoTurnSettings()
  let opened = false
  return (book: Book) => {
    if (!opened && book.isBuilt && book.isIdle) {
      const front = Math.max(1, Math.round(book.coverPaperCount / 2))
      book.startAutoTurning(AutoTurnDirection.Next, settings, front + extra)
      opened = true
    }
  }
}

/** Shared base BookOptions — matches the library's own demo defaults. */
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

/** A draggable book — the baseline example. Starts closed, opens to the first spread. */
export function LiveBook({
  pageCount = 8,
  hint = 'Drag a page to turn it · drag the background to orbit',
}: { pageCount?: number; hint?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount })
      const book = new Book({ content, ...baseOptions() })
      const autoOpen = makeAutoOpen()
      return { book, onFrame: () => autoOpen(book), cleanup: () => textures.forEach((t) => t.dispose()) }
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
      const { content, textures } = buildBookContent({ pageCount: 10 })
      const book = new Book({ content, ...baseOptions() })
      const autoOpen = makeAutoOpen()
      return { book, onFrame: () => autoOpen(book), cleanup: () => textures.forEach((t) => t.dispose()) }
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

/** Instant jumps with book.setOpenProgress(t). */
export function LiveOpenProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(0.5)
  const { bookRef } = useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount: 8 })
      const book = new Book({ content, ...baseOptions({ initialOpenProgress: 0.5 }) })
      return { book, cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  const onChange = (val: number) => { setV(val); bookRef.current?.setOpenProgress(val) }
  return (
    <LiveStage
      ref={ref}
      hint="The slider calls book.setOpenProgress(t) — an instant jump from closed (0) to fully open (1)"
      controls={<LiveSlider label="openProgress" min={0} max={1} step={0.01} value={v} onChange={onChange} format={(x) => x.toFixed(2)} />}
    />
  )
}

/** Read-only state, polled each frame off the live book. */
export function LiveBookState() {
  const ref = useRef<HTMLDivElement>(null)
  const { bookRef } = useBookStage(ref, {
    make: () => {
      const { content, textures } = buildBookContent({ pageCount: 8 })
      const book = new Book({ content, ...baseOptions() })
      const autoOpen = makeAutoOpen()
      return { book, onFrame: () => autoOpen(book), cleanup: () => textures.forEach((t) => t.dispose()) }
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
  const params = useRef({ pageCount: 8, thickness: 0.02, stiffness: 0.2, pageColor: '#f5efe0', coverColor: '#7b3f00' })
  const [, force] = useState(0)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const p = params.current
      const { content, textures } = buildBookContent({ pageCount: p.pageCount, pageColor: p.pageColor, coverColor: p.coverColor })
      const book = new Book({
        content,
        ...baseOptions({ pagePaperSetup: { ...pagePaperSetup(PAGE_W, PAGE_H), thickness: p.thickness, stiffness: p.stiffness } }),
      })
      const autoOpen = makeAutoOpen()
      return { book, onFrame: () => autoOpen(book), cleanup: () => textures.forEach((t) => t.dispose()) }
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
      const { content, textures } = buildBookContent({ pageCount: 8 })
      const book = new Book({ content, ...baseOptions({ hideBinder: hide.current }) })
      const autoOpen = makeAutoOpen()
      return { book, onFrame: () => autoOpen(book), cleanup: () => textures.forEach((t) => t.dispose()) }
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

/** Load the pattern image once, then rebuild the book so it draws. */
function usePatternImage(rebuild: () => void) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  useEffect(() => {
    let alive = true
    loadPatternImage((im) => { if (alive) { imgRef.current = im; rebuild() } })
    return () => { alive = false }
  }, [rebuild])
  return imgRef
}

/** A double-page spread — one image across two facing pages (odd-indexed starts). */
export function LiveSpread() {
  const ref = useRef<HTMLDivElement>(null)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const textures: THREE.Texture[] = []
      const track = (t: THREE.Texture) => { textures.push(t); return t }
      const content = new BookContent()
      for (let i = 0; i < 4; i++) content.covers.push(track(createPageTexture('#7b3f00', '', null, 'contain', false, PAGE_W + 0.1, PAGE_H + 0.1)))

      // page 0 normal, then three spreads at odd start indices (1, 3, 5), page 7 normal.
      content.pages.push(track(createPageTexture('#f5efe0', 'Page 1', null, 'contain', false, PAGE_W, PAGE_H)))
      const spreads: SpreadContent[] = []
      for (let s = 0; s < 3; s++) {
        const wide = track(createPageTexture('#0b1020', '', imgRef.current, 'cover', true, PAGE_W * 2, PAGE_H))
        const spread = new SpreadContent({ pageWidth: PCW, pageHeight: PCH })
        spread.source = (wide as THREE.CanvasTexture).image as HTMLCanvasElement
        spread.addText({ text: s === 1 ? 'One image, two pages' : '', x: 120, y: 90, width: 780, fontSize: 54, fontFamily: 'Georgia', color: '#ffffff', textAlign: 'center' })
        spread.markDirty()
        content.pages.push(spread.left)
        content.pages.push(spread.right)
        spreads.push(spread)
      }
      content.pages.push(track(createPageTexture('#f5efe0', 'Page 8', null, 'contain', false, PAGE_W, PAGE_H)))

      const book = new Book({ content, ...baseOptions() })
      // Open well into the content so a spread (pages 1–6) is the visible flat pair.
      const openToSpread = makeAutoOpen(4)
      return {
        book,
        onFrame: () => { for (const sp of spreads) sp.update(book); openToSpread(book) },
        cleanup: () => { spreads.forEach((s) => s.dispose()); textures.forEach((t) => t.dispose()) },
      }
    },
  })
  const imgRef = usePatternImage(rebuild)
  return <LiveStage ref={ref} hint="A SpreadContent puts one image across two facing pages — drag to leaf through the spreads" />
}

/** Live text overlaid on every page with TextOverlayContent. */
export function LiveTextOverlay() {
  const ref = useRef<HTMLDivElement>(null)
  const text = useRef('Chapter One')
  const [, force] = useState(0)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const textures: THREE.Texture[] = []
      const track = (t: THREE.Texture) => { textures.push(t); return t }
      const content = new BookContent()
      for (let i = 0; i < 4; i++) content.covers.push(track(createPageTexture('#7b3f00', '', null, 'contain', false, PAGE_W + 0.1, PAGE_H + 0.1)))

      const overlays: TextOverlayContent[] = []
      for (let i = 0; i < 8; i++) {
        const base = createPageTexture('#f5efe0', '', null, 'contain', false, PAGE_W, PAGE_H)
        track(base)
        const overlay = new TextOverlayContent({ width: PCW, height: PCH, source: (base as THREE.CanvasTexture).image as HTMLCanvasElement })
        overlay.addText({ text: text.current, x: 60, y: 150, width: 392, fontSize: 44, fontFamily: 'Georgia', fontStyle: 'italic', color: '#1a1a1a', textAlign: 'center', shadowColor: 'rgba(0,0,0,0.25)', shadowBlur: 6 })
        content.pages.push(overlay)
        overlays.push(overlay)
      }

      const book = new Book({ content, ...baseOptions({ initialOpenProgress: 0.5 }) })
      return {
        book,
        onFrame: () => { for (const o of overlays) o.update(book) },
        cleanup: () => { overlays.forEach((o) => o.dispose()); textures.forEach((t) => t.dispose()) },
      }
    },
  })
  const pick = (t: string) => { text.current = t; force((n) => n + 1); rebuild() }
  return (
    <LiveStage
      ref={ref}
      hint="A TextOverlayContent composites a styled TextBlock onto the page"
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

/** An image on a page with the three fit modes. */
export function LiveTextures() {
  const ref = useRef<HTMLDivElement>(null)
  const cfg = useRef<{ fit: 'contain' | 'cover' | 'fill'; fullBleed: boolean }>({ fit: 'cover', fullBleed: true })
  const [, force] = useState(0)
  const { rebuild } = useBookStage(ref, {
    make: () => {
      const img = imgRef.current
      const textures: THREE.Texture[] = []
      const track = (t: THREE.Texture) => { textures.push(t); return t }
      const content = new BookContent()
      for (let i = 0; i < 4; i++) content.covers.push(track(createPageTexture('#7b3f00', '', null, 'contain', false, PAGE_W + 0.1, PAGE_H + 0.1)))
      // Every page carries the image so the open middle spread shows the fit mode.
      for (let i = 0; i < 8; i++) content.pages.push(track(createPageTexture('#f5efe0', '', img, cfg.current.fit, cfg.current.fullBleed, PAGE_W, PAGE_H)))
      const book = new Book({ content, ...baseOptions({ initialOpenProgress: 0.5 }) })
      return { book, cleanup: () => textures.forEach((t) => t.dispose()) }
    },
  })
  const imgRef = usePatternImage(rebuild)
  const setFit = (f: 'contain' | 'cover' | 'fill') => { cfg.current = { ...cfg.current, fit: f }; force((n) => n + 1); rebuild() }
  return (
    <LiveStage
      ref={ref}
      hint="createPageTexture draws the image with the chosen fit mode onto the page"
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
