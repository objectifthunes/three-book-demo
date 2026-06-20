import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveBook } from '@/components/live/examples'

const e = findExport('/content/spreads/')!

const CODE = `import * as THREE from 'three'
import { BookContent, SpreadContent, getSpreadPairs, createPageTexture, PX_PER_UNIT } from '@objectifthunes/three-book'

const pageCW = Math.round(4 * PX_PER_UNIT)
const pageCH = Math.round(6 * PX_PER_UNIT)

// One image spanning both facing pages — draw it at DOUBLE page width.
const spreadBase = createPageTexture('#f4ecd8', 'Spread 3-4', null, 'cover', false, 8, 6)

const spread = new SpreadContent({
  pageWidth: pageCW,
  pageHeight: pageCH,
  source: (spreadBase as THREE.CanvasTexture).image as HTMLCanvasElement,
})

// Text is positioned in spread coordinates (0 .. 2 * pageWidth across).
spread.addText({
  text: 'A View Across Two Pages',
  x: 100,
  y: 700,
  width: 900,
  fontSize: 48,
  textAlign: 'center',
})

const content = new BookContent()
// ...push the pages that precede the spread...

// A spread occupies two CONSECUTIVE page slots: left then right.
content.pages.push(spread.left)  // left facing page  (UVs x = [0, 0.5])
content.pages.push(spread.right) // right facing page (UVs x = [0.5, 1])

// Eligible spread start indices for a given page count (odd indices, i+1 in range):
const starts = getSpreadPairs(content.pages.length) // e.g. [1, 3, 5, ...]

// Per-frame: one update() refreshes both halves.
function frame() {
  spread.update(book) // book is a THREE.Object3D
  requestAnimationFrame(frame)
}

// On teardown:
// spread.dispose()`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveBook pageCount={10} hint="Drag through the book — the source below shows how SpreadContent spans one image across a facing pair" />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="CONSTRUCTOR — SpreadContentOptions"
        rows={[
          { name: 'pageWidth', type: 'number', def: '512', desc: 'Width of a single page in pixels. The internal canvas is twice this wide.' },
          { name: 'pageHeight', type: 'number', def: '512', desc: 'Height of a single page in pixels.' },
          { name: 'source', type: 'HTMLCanvasElement | HTMLImageElement | null', def: 'null', desc: 'The base image drawn across the full spread width. Render it at 2x page width so each half lines up.' },
        ]}
      />
      <PropTable
        label="MEMBERS & METHODS"
        cols={['Member', 'Signature', '', 'What it does']}
        rows={[
          { name: 'left', type: 'IPageContent', desc: 'The left facing half — its textureST crops the shared texture to x = [0, 0.5]. Push into the first of the two page slots.' },
          { name: 'right', type: 'IPageContent', desc: 'The right facing half — crops to x = [0.5, 1]. Push into the next slot.' },
          { name: 'addText', type: '(opts?: TextBlockOptions) => TextBlock', desc: 'Add a styled block in spread coordinates (it may straddle the gutter). Returns the TextBlock.' },
          { name: 'removeText / updateText', type: '(…) => void', desc: 'Remove a block, or patch one by index with Partial<TextBlockOptions>.' },
          { name: 'update', type: '(root?: THREE.Object3D) => void', desc: 'Re-composite both halves in one call. Pass the book root so the cloned page materials refresh. Call each frame.' },
          { name: 'getSpreadPairs', type: '(pageCount: number) => number[]', desc: 'Exported helper: the 0-indexed page indices where a spread can start (odd indices with a facing neighbour).' },
          { name: 'source / markDirty / texts', type: '…', desc: 'Same accessors as TextOverlayContent: settable base layer, force-redraw flag, and the live block list.' },
          { name: 'dispose', type: '() => void', desc: 'Release the shared CanvasTexture and free the canvas.' },
        ]}
      />
      <Notes>
        <p>
          A spread is <em>one</em> image drawn across both facing pages. <code>SpreadContent</code> keeps a
          double-width canvas and exposes two thin{' '}
          <Link href="/content/page-content/">IPageContent</Link> views, <code>spread.left</code> and{' '}
          <code>spread.right</code>, each cropping its half via <code>textureST</code>. Push them into two{' '}
          <em>consecutive</em> <code>content.pages</code> slots, left first.
        </p>
        <p>
          Use <code>getSpreadPairs(pageCount)</code> to find where a spread may legally start — in a
          staple-bound book the facing pairs are <code>(1,2)</code>, <code>(3,4)</code>, <code>(5,6)</code> and
          so on. As with a <Link href="/content/text-overlay/">TextOverlayContent</Link>, call{' '}
          <code>spread.update(book)</code> every frame so edits and the source layer are recomposited onto both
          halves at once.
        </p>
      </Notes>
    </ExportPage>
  )
}
