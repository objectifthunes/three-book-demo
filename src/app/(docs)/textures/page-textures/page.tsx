import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/textures/page-textures/')!

const CODE = `import * as THREE from 'three'
import {
  createPageTexture,
  createPageCanvas,
  loadImage,
  PX_PER_UNIT,
} from '@objectifthunes/three-book'

// A page is 2 x 3 world units. Canvases are sized at PX_PER_UNIT (256) px/unit,
// so this page texture is 512 x 768 px — pass pageW/pageH to match the aspect.
const pageW = 2
const pageH = 3

// 1. A plain coloured page with a centred label (handy while prototyping).
const labelled = createPageTexture(
  '#fdf6e3',          // color   — canvas background fill
  'Chapter One',      // text    — centred label, drawn only when image is null
  null,               // image   — no image
  'contain',          // fitMode — ignored without an image
  false,              // fullBleed
  pageW,
  pageH,
)

// 2. A page built from an uploaded File (e.g. from an <input type="file" />).
const loaded = await loadImage(file)            // -> { image, objectUrl } | null
const photo = createPageTexture(
  '#ffffff',
  '',
  loaded ? loaded.image : null,
  'cover',            // crop-to-fill the page
  true,               // fullBleed — no inner margin
  pageW,
  pageH,
)

// Assign to your page content / material map…
material.map = photo
material.needsUpdate = true

// You own these textures — dispose them when you rebuild or tear down.
labelled.dispose()
photo.dispose()
if (loaded) URL.revokeObjectURL(loaded.objectUrl)

// Need just the canvas (e.g. as a TextOverlayContent source)? Skip the texture:
const canvas: HTMLCanvasElement = createPageCanvas(
  '#fdf6e3', 'Chapter One', null, 'contain', false, pageW, pageH,
)`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="CREATEPAGETEXTURE / CREATEPAGECANVAS ARGS"
        cols={['Arg', 'Type', 'Default', 'Meaning']}
        rows={[
          { name: 'color', type: 'string', desc: 'CSS colour string used to fill the canvas background.' },
          { name: 'text', type: 'string', desc: 'Centred label, drawn only when image is null — useful for debugging.' },
          { name: 'image', type: 'HTMLImageElement | null', def: 'null', desc: 'The image to draw onto the page, or null for a plain/labelled page.' },
          { name: 'fitMode', type: "'contain' | 'cover' | 'fill'", desc: 'How the image is scaled into the page. See Images & fit.' },
          { name: 'fullBleed', type: 'boolean', desc: 'When true the image fills edge-to-edge; otherwise an ~11% inner margin is left.' },
          { name: 'pageW', type: 'number?', def: '—', desc: 'Page width in world units. Sets canvas width = round(pageW × 256).' },
          { name: 'pageH', type: 'number?', def: '—', desc: 'Page height in world units. Omit pageW/pageH for a default 512 × 512 canvas.' },
          { name: 'imageRect', type: 'ImageRect | null', def: 'null', desc: 'Exact pixel rect to draw the image into, overriding fitMode/fullBleed.' },
        ]}
      />
      <PropTable
        label="ALSO EXPORTED"
        cols={['Name', 'Type', '', 'Role']}
        rows={[
          { name: 'createPageTexture', type: '(…) => THREE.Texture', desc: 'Returns a THREE.CanvasTexture in sRGB colour space — ready as a material map.' },
          { name: 'createPageCanvas', type: '(…) => HTMLCanvasElement', desc: 'Same arguments, returns the raw canvas — no texture allocation to dispose.' },
          { name: 'PX_PER_UNIT', type: 'number = 256', desc: 'Pixels per world unit, used to size the canvas from pageW / pageH.' },
        ]}
      />
      <Notes>
        <p>
          <code>createPageTexture</code> and <code>createPageCanvas</code> take the{' '}
          <em>same eight arguments in the same order</em>; the only difference is the return value.
          Reach for the canvas variant when something downstream (such as a{' '}
          <Link href="/content/text-overlay/">TextOverlayContent</Link> source) wants an{' '}
          <code>HTMLCanvasElement</code> directly — it avoids allocating a{' '}
          <code>THREE.Texture</code> you would then have to dispose.
        </p>
        <p>
          These helpers do <strong>not</strong> track or free anything for you. Each{' '}
          <code>createPageTexture</code> call returns a fresh GPU texture, so call{' '}
          <code>texture.dispose()</code> whenever you rebuild a page or tear the book down, and{' '}
          <code>URL.revokeObjectURL()</code> on any object URL from{' '}
          <Link href="/textures/images/">loadImage</Link>. See{' '}
          <Link href="/content/book-content/">BookContent</Link> for where the resulting textures are
          assigned.
        </p>
      </Notes>
    </ExportPage>
  )
}
