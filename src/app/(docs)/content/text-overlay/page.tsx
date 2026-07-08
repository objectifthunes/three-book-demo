import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/content/text-overlay/')!

const CODE = `import * as THREE from 'three'
import { BookContent, TextOverlayContent, createPageTexture, PX_PER_UNIT } from '@objectifthunes/three-book'

// A base page image — colour + label + optional photo, as a CanvasTexture.
const baseTex = createPageTexture('#f4ecd8', 'Chapter One', null, 'cover', false, 4, 6)

// The overlay composites text on top of that base, every frame.
const overlay = new TextOverlayContent({
  width: Math.round(4 * PX_PER_UNIT),
  height: Math.round(6 * PX_PER_UNIT),
  source: (baseTex as THREE.CanvasTexture).image as HTMLCanvasElement,
})

// addText returns the TextBlock so you can tweak it later.
overlay.addText({
  text: 'The Lighthouse',
  x: 60,
  y: 700,
  width: 480,
  fontFamily: 'Georgia',
  fontSize: 56,
  fontWeight: 'bold',
  color: '#1a1a1a',
  textAlign: 'center',
  shadowColor: 'rgba(0,0,0,0.35)',
  shadowBlur: 6,
})

// TextOverlayContent IS an IPageContent — push it straight into pages.
const content = new BookContent()
content.pages.push(overlay)

// In your render loop, re-composite (pass the book root so three-book picks
// up the refreshed canvas texture on the cloned page material):
function frame() {
  overlay.update(book) // book is a THREE.Object3D
  requestAnimationFrame(frame)
}

// On teardown:
// overlay.dispose()`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="CONSTRUCTOR — TextOverlayContentOptions"
        rows={[
          { name: 'width', type: 'number', def: '512', desc: 'Overlay canvas width in pixels. Match the page texture for crisp text.' },
          { name: 'height', type: 'number', def: '512', desc: 'Overlay canvas height in pixels.' },
          { name: 'source', type: 'HTMLCanvasElement | HTMLImageElement | null', def: 'null', desc: 'The base layer drawn full-size beneath the text. The demo passes the .image of a createPageTexture CanvasTexture.' },
        ]}
      />
      <PropTable
        label="METHODS & MEMBERS"
        cols={['Member', 'Signature', '', 'What it does']}
        rows={[
          { name: 'addText', type: '(opts?: TextBlockOptions) => TextBlock', desc: 'Append a styled text block and return it. See TextBlock for the full option list.' },
          { name: 'removeText', type: '(text: TextBlock) => void', desc: 'Remove a previously added block.' },
          { name: 'updateText', type: '(index, Partial<TextBlockOptions>) => void', desc: 'Patch one block in place by index — only the provided fields change.' },
          { name: 'update', type: '(root?: THREE.Object3D) => void', desc: 'Re-composite: clear canvas, draw source, draw every text block, flag the texture. Pass the book root so cloned page materials refresh. Call each frame.' },
          { name: 'source', type: 'HTMLCanvasElement | HTMLImageElement | null', desc: 'Get/set the base layer; setting it marks the overlay dirty.' },
          { name: 'markDirty', type: '() => void', desc: 'Force a re-composite on the next update().' },
          { name: 'texts', type: 'readonly TextBlock[]', desc: 'The live blocks, in draw order.' },
          { name: 'texture / textureST', type: 'THREE.Texture / THREE.Vector4', desc: 'IPageContent surface — the CanvasTexture and its identity ST.' },
          { name: 'dispose', type: '() => void', desc: 'Release the CanvasTexture and free the canvas. Call on teardown.' },
        ]}
      />
      <Notes>
        <p>
          <code>TextOverlayContent</code> implements{' '}
          <Link href="/content/page-content/">IPageContent</Link>, so you push the overlay itself into{' '}
          <code>content.pages</code> — not its texture. It keeps its own canvas, draws your{' '}
          <code>source</code> image as the base layer, then paints each{' '}
          <Link href="/content/text-block/">TextBlock</Link> on top.
        </p>
        <p>
          You must call <code>overlay.update()</code> in your loop for changes to show — it only redraws when
          dirty (or when a <code>source</code> is present, since an external canvas can change at any time).
          Pass the book as the <code>root</code> argument so three-book re-flags the cloned page material that
          holds this canvas. For one image spanning two facing pages, use{' '}
          <Link href="/content/spreads/">SpreadContent</Link> instead.
        </p>
      </Notes>
    </ExportPage>
  )
}
