'use client'

/**
 * The two flagship canvases of the docs: one playground per binding, with the
 * full option surface live — content, paper, spine setup, turning, and a
 * WYSIWYG layer (headline + cover/spine titles you type straight onto the
 * book). Every other page links here instead of mounting its own canvas.
 */

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Book,
  StapleBookBinding,
  GluedBookBinding,
  TextOverlayContent,
  AutoTurnSettings,
  AutoTurnDirection,
  PX_PER_UNIT,
} from '@objectifthunes/three-book'
import { useBookStage } from './useBookStage'
import { LiveStage } from './LiveStage'
import { LiveRow, LiveButton, LiveSlider, LiveToggle, LiveSwatch, LiveTextInput } from './controls'
import {
  buildBookContent,
  buildStorybookContent,
  loadStorybookArt,
  pagePaperSetup,
  coverPaperSetup,
} from './book-content'

const PAGE_W = 2
const PAGE_H = 3
const PCW = Math.round(PAGE_W * PX_PER_UNIT)
const PCH = Math.round(PAGE_H * PX_PER_UNIT)

export type PlaygroundKind = 'staple' | 'glued'

interface Params {
  // content
  fantasy: boolean
  pageCount: number
  pageColor: string
  coverColor: string
  // paper
  pageThickness: number
  stiffness: number
  coverThickness: number
  rigid: boolean
  // book
  alignToGround: boolean
  hideBinder: boolean
  // staple spine
  stapleCount: number
  stapleCrown: number
  // glued spine
  hingeGap: number
  glueFlex: number
  spineColor: string
  // WYSIWYG
  headline: string
  spineTitle: string
}

function defaults(kind: PlaygroundKind): Params {
  return {
    fantasy: true,
    pageCount: 8,
    pageColor: '#f5efe0',
    coverColor: kind === 'glued' ? '#7a1f1f' : '#7b3f00',
    pageThickness: 0.02,
    stiffness: 0.2,
    coverThickness: kind === 'glued' ? 0.06 : 0.04,
    rigid: kind === 'glued',
    alignToGround: true,
    hideBinder: false,
    stapleCount: 4,
    stapleCrown: 0.2,
    hingeGap: 0.03,
    glueFlex: 0.12,
    spineColor: '#7a1f1f',
    headline: 'Once upon a time…',
    spineTitle: 'A STORYBOOK',
  }
}

/** Title art rendered down the spine, the classic rotated way. */
function makeSpineTexture(title: string, color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 768
  const ctx = c.getContext('2d')!
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 128, 768)
  ctx.fillStyle = '#f0d9a8'
  ctx.font = 'bold 44px Georgia'
  ctx.textAlign = 'center'
  ctx.save()
  ctx.translate(64, 384)
  ctx.rotate(Math.PI / 2)
  ctx.fillText(title, 0, 14)
  ctx.restore()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function Playground({ kind }: { kind: PlaygroundKind }) {
  const ref = useRef<HTMLDivElement>(null)
  const p = useRef<Params>(defaults(kind))
  const [, force] = useState(0)
  const [openV, setOpenV] = useState(0)
  const settings = useRef(new AutoTurnSettings())

  const { bookRef, rebuild } = useBookStage(ref, {
    make: () => {
      const cfg = p.current
      const disposables: { dispose: () => void }[] = []

      const { content, textures } = cfg.fantasy
        ? buildStorybookContent(cfg.pageCount, PAGE_W, PAGE_H)
        : buildBookContent({ pageCount: cfg.pageCount, pageColor: cfg.pageColor, coverColor: cfg.coverColor, pageW: PAGE_W, pageH: PAGE_H })
      disposables.push(...textures)

      // WYSIWYG headline: composite the typed text over page 1's own art.
      let overlay: TextOverlayContent | null = null
      if (cfg.headline.trim()) {
        const base = content.pages[0] as THREE.CanvasTexture | null
        if (base && base.image) {
          overlay = new TextOverlayContent({ width: PCW, height: PCH, source: base.image as HTMLCanvasElement })
          overlay.addText({
            text: cfg.headline,
            x: 48, y: 120, width: PCW - 96,
            fontSize: 42, fontFamily: 'Georgia', fontStyle: 'italic',
            color: '#241a10', textAlign: 'center',
            shadowColor: 'rgba(255,246,220,0.85)', shadowBlur: 10,
          })
          content.pages = [overlay, ...content.pages.slice(1)] as typeof content.pages
          disposables.push(overlay)
        }
      }

      let binding: StapleBookBinding | GluedBookBinding
      if (kind === 'staple') {
        const b = new StapleBookBinding()
        b.stapleSetup.count = cfg.stapleCount
        b.stapleSetup.crown = cfg.stapleCrown
        binding = b
      } else {
        const b = new GluedBookBinding()
        b.setup.hingeGap = cfg.hingeGap
        b.setup.glueFlexWidth = cfg.glueFlex
        b.setup.spineColor = new THREE.Color(cfg.spineColor)
        if (cfg.spineTitle.trim()) {
          const spineTex = makeSpineTexture(cfg.spineTitle, cfg.spineColor)
          b.setup.spineTexture = spineTex
          disposables.push(spineTex)
        }
        binding = b
      }

      const book = new Book({
        content,
        binding,
        initialOpenProgress: 0,
        castShadows: true,
        alignToGround: cfg.alignToGround,
        hideBinder: cfg.hideBinder,
        pagePaperSetup: { ...pagePaperSetup(PAGE_W, PAGE_H), thickness: cfg.pageThickness, stiffness: cfg.stiffness },
        coverPaperSetup: { ...coverPaperSetup(PAGE_W, PAGE_H), thickness: cfg.coverThickness, rigid: cfg.rigid },
      })

      let opened = false
      return {
        book,
        onFrame: () => {
          overlay?.update(book)
          if (!opened && book.isBuilt) {
            // Open with page 1 (the WYSIWYG page) as the right-hand page.
            book.setOpenProgressByIndex(book.coverPaperCount)
            opened = true
          }
        },
        cleanup: () => disposables.forEach((d) => d.dispose()),
      }
    },
  })

  // Fantasy art decodes async — rebuild once it lands.
  useEffect(() => {
    let alive = true
    loadStorybookArt().then(() => { if (alive) rebuild() })
    return () => { alive = false }
  }, [rebuild])

  const set = <K extends keyof Params>(k: K, v: Params[K]) => {
    p.current = { ...p.current, [k]: v }
    force((n) => n + 1)
    rebuild()
  }
  const turn = (dir: AutoTurnDirection, count = 1) =>
    bookRef.current?.startAutoTurning(dir, settings.current, count)
  const v = p.current

  return (
    <LiveStage
      ref={ref}
      tall
      hint="Drag a page to turn it · drag the background to orbit · right-drag to pan · every control below is live"
      controls={
        <>
          <LiveRow>
            <LiveButton onClick={() => turn(AutoTurnDirection.Next, 1)}>Next ▸</LiveButton>
            <LiveButton onClick={() => turn(AutoTurnDirection.Back, 1)}>◂ Prev</LiveButton>
            <LiveButton onClick={() => turn(AutoTurnDirection.Next, 99)}>Flip to end</LiveButton>
            <LiveButton onClick={() => turn(AutoTurnDirection.Back, 99)}>Back to start</LiveButton>
            <LiveSlider
              label="openProgress" min={0} max={1} step={0.01} value={openV}
              onChange={(x) => { setOpenV(x); bookRef.current?.setOpenProgress(x) }}
              format={(x) => x.toFixed(2)}
            />
          </LiveRow>
          <LiveRow>
            <LiveSlider label="pages" min={2} max={20} step={2} value={v.pageCount} onChange={(x) => set('pageCount', x)} />
            <LiveSlider label="page thickness" min={0.008} max={0.05} step={0.002} value={v.pageThickness} onChange={(x) => set('pageThickness', x)} format={(x) => x.toFixed(3)} />
            <LiveSlider label="stiffness" min={0.05} max={0.9} step={0.05} value={v.stiffness} onChange={(x) => set('stiffness', x)} format={(x) => x.toFixed(2)} />
            <LiveSlider label="cover thickness" min={0.02} max={0.1} step={0.005} value={v.coverThickness} onChange={(x) => set('coverThickness', x)} format={(x) => x.toFixed(3)} />
            {kind === 'glued'
              ? <LiveToggle label="rigid boards" checked={v.rigid} onChange={(x) => set('rigid', x)} />
              : <LiveToggle label="hideBinder" checked={v.hideBinder} onChange={(x) => set('hideBinder', x)} />}
            <LiveToggle label="alignToGround" checked={v.alignToGround} onChange={(x) => set('alignToGround', x)} />
          </LiveRow>
          <LiveRow>
            {kind === 'staple' ? (
              <>
                <LiveSlider label="staples" min={2} max={10} step={1} value={v.stapleCount} onChange={(x) => set('stapleCount', x)} />
                <LiveSlider label="crown" min={0.05} max={0.4} step={0.01} value={v.stapleCrown} onChange={(x) => set('stapleCrown', x)} format={(x) => x.toFixed(2)} />
              </>
            ) : (
              <>
                <LiveSlider label="hingeGap" min={0.005} max={0.1} step={0.005} value={v.hingeGap} onChange={(x) => set('hingeGap', x)} format={(x) => x.toFixed(3)} />
                <LiveSlider label="glueFlex" min={0.04} max={0.3} step={0.01} value={v.glueFlex} onChange={(x) => set('glueFlex', x)} format={(x) => x.toFixed(2)} />
                <LiveSwatch label="spine" value={v.spineColor} onChange={(x) => set('spineColor', x)} />
              </>
            )}
            <LiveToggle label="storybook art" checked={v.fantasy} onChange={(x) => set('fantasy', x)} />
            {!v.fantasy && (
              <>
                <LiveSwatch label="page" value={v.pageColor} onChange={(x) => set('pageColor', x)} />
                <LiveSwatch label="cover" value={v.coverColor} onChange={(x) => set('coverColor', x)} />
              </>
            )}
          </LiveRow>
          <LiveRow>
            <LiveTextInput label="page 1 headline" value={v.headline} onChange={(x) => set('headline', x)} placeholder="Type onto the page…" />
            {kind === 'glued' && (
              <LiveTextInput label="spine title" value={v.spineTitle} onChange={(x) => set('spineTitle', x)} placeholder="Down the spine…" />
            )}
          </LiveRow>
        </>
      }
    />
  )
}
