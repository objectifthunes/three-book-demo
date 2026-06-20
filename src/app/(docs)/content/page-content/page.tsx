import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/content/page-content/')!

const CODE = `import * as THREE from 'three'
import {
  BookContent,
  SpritePageContent2,
  PageContent,        // abstract base for custom per-frame content
  type IPageContent,
} from '@objectifthunes/three-book'

const content = new BookContent()

// 1. The simplest path: push a raw texture. BookContent wraps it in a
//    SpritePageContent2 for you.
content.pages.push(myTexture) // THREE.Texture

// 2. Or wrap it yourself to crop an atlas via textureST = (sx, sy, ox, oy):
const cropped = new SpritePageContent2(
  atlasTexture,
  new THREE.Vector4(0.5, 1, 0, 0), // show the left half
)
content.pages.push(cropped)

// 3. A custom IPageContent that updates each frame and hit-tests UI:
class ClockPage extends PageContent {
  private tex: THREE.CanvasTexture
  constructor(private canvas: HTMLCanvasElement) {
    super()
    this.tex = new THREE.CanvasTexture(canvas)
  }
  get texture(): THREE.Texture { return this.tex }
  // redraw the canvas, then:  this.tex.needsUpdate = true
  protected onIsPointOverUI(uv: THREE.Vector2): boolean {
    return uv.x > 0.8 && uv.y > 0.8 // a button in the corner
  }
}
content.pages.push(new ClockPage(document.createElement('canvas')))`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="IPAGECONTENT"
        cols={['Member', 'Type', '', 'Meaning']}
        rows={[
          { name: 'texture', type: 'readonly THREE.Texture | null', desc: 'The image drawn on this page side. null renders blank.' },
          { name: 'textureST', type: 'readonly THREE.Vector4', desc: 'Scale/translate applied to UVs as (scaleX, scaleY, offsetX, offsetY) — use it to crop into an atlas or show one half of a shared texture. Identity is (1, 1, 0, 0).' },
          { name: 'isPointOverUI', type: '(uv: THREE.Vector2) => boolean', desc: 'Return true when the texture coordinate lands on interactive UI, so a drag there does not turn the page.' },
          { name: 'init', type: '(bookContent: BookContent) => void', desc: 'Called once when the content is attached to a book — set up GPU resources here.' },
          { name: 'setActive', type: '(active: boolean) => void', desc: 'Called as the page becomes visible / hidden — a cue to start or pause per-frame work.' },
        ]}
      />
      <PropTable
        label="IMPLEMENTATIONS"
        cols={['Type', 'Constructor', '', 'Use it for']}
        rows={[
          { name: 'SpritePageContent2', type: 'new SpritePageContent2(texture, textureST?)', desc: 'A static page backed by one THREE.Texture, with optional textureST cropping. This is what a bare texture in pages[] becomes.' },
          { name: 'PageContent', type: 'abstract base class', desc: 'Subclass it for live content — override texture, onInit(), onActiveChanged() and onIsPointOverUI(uv). TextOverlayContent and SpreadContent are built on the same IPageContent contract.' },
        ]}
      />
      <Notes>
        <p>
          Pass a raw <code>THREE.Texture</code> when a page is a fixed image — it is the least code, and{' '}
          <Link href="/content/book-content/">BookContent</Link> wraps it in a <code>SpritePageContent2</code>{' '}
          automatically. Reach for a full <code>IPageContent</code> when the page must update every frame
          (animated canvas, video) or respond to taps, since only an <code>IPageContent</code> exposes{' '}
          <code>isPointOverUI(uv)</code> and a per-frame <code>texture</code>.
        </p>
        <p>
          For the common case of styled text on an image you usually do not write a class at all — use{' '}
          <Link href="/content/text-overlay/">TextOverlayContent</Link> for a single page or{' '}
          <Link href="/content/spreads/">SpreadContent</Link> for a two-page spread. Both implement{' '}
          <code>IPageContent</code> and slot straight into <code>content.pages</code>.
        </p>
      </Notes>
    </ExportPage>
  )
}
