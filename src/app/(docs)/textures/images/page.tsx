import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/textures/images/')!

const CODE = `import {
  loadImage,
  drawImageWithFit,
  computeDefaultImageRect,
  type ImageFitMode,
  type ImageRect,
  type LoadedImage,
} from '@objectifthunes/three-book'

// Load a File picked from an <input type="file" /> (returns null on failure).
const input = document.querySelector<HTMLInputElement>('#file')!
const file = input.files?.[0] ?? null

const loaded: LoadedImage | null = await loadImage(file)
if (!loaded) return                 // null file / decode error

const { image, objectUrl } = loaded
const fit: ImageFitMode = 'cover'
const fullBleed = false

// Draw the image into a canvas, fitted to the page.
const canvas = document.createElement('canvas')
canvas.width = 512
canvas.height = 768
const ctx = canvas.getContext('2d')!

// Compute the default rect the helper would use (margin from fullBleed).
const rect: ImageRect = computeDefaultImageRect(
  image, canvas.width, canvas.height, fit, fullBleed,
)

// Either draw inside an explicit area with a fit mode…
drawImageWithFit(ctx, image, 0, 0, canvas.width, canvas.height, fit)

// …or draw at the exact computed rect (e.g. after the user nudges it).
ctx.drawImage(image, rect.x, rect.y, rect.width, rect.height)

// You own the object URL — revoke it once the image is no longer needed.
URL.revokeObjectURL(objectUrl)`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="FUNCTIONS"
        cols={['Name', 'Signature', '', 'Role']}
        rows={[
          { name: 'loadImage', type: '(file: File | null | undefined) => Promise<LoadedImage | null>', desc: 'Decodes a File into an HTMLImageElement; resolves null on a missing file or decode error.' },
          { name: 'drawImageWithFit', type: '(ctx, image, x, y, width, height, fit) => void', desc: 'Draws image into the (x, y, width, height) rect of a 2D context using the fit mode.' },
          { name: 'computeDefaultImageRect', type: '(image, canvasWidth, canvasHeight, fitMode, fullBleed) => ImageRect', desc: 'Returns the pixel rect drawImageWithFit would use — a good initial ImageRect to then adjust.' },
        ]}
      />
      <PropTable
        label="FIT MODES — ImageFitMode"
        cols={['Mode', 'Aspect', '', 'Behaviour']}
        rows={[
          { name: "'contain'", type: 'preserved', desc: 'Letterbox: scale uniformly to fit inside the area; gaps may show the background colour.' },
          { name: "'cover'", type: 'preserved', desc: 'Crop-to-fill: scale uniformly to cover the whole area; the overflow is clipped off.' },
          { name: "'fill'", type: 'ignored', desc: 'Stretch the image to fill the area exactly, distorting its aspect ratio.' },
        ]}
      />
      <PropTable
        label="TYPES"
        cols={['Type', 'Shape', '', 'Notes']}
        rows={[
          { name: 'ImageFitMode', type: "'contain' | 'cover' | 'fill'", desc: 'The three scaling strategies above.' },
          { name: 'ImageRect', type: '{ x; y; width; height }', desc: 'A rectangle in canvas pixels — where and how big the image is drawn.' },
          { name: 'LoadedImage', type: '{ image: HTMLImageElement; objectUrl: string }', desc: 'The decoded image plus the object URL it came from (revoke it when done).' },
        ]}
      />
      <Notes>
        <p>
          <code>fullBleed</code> decides the margin around the image, not the fit. When{' '}
          <code>false</code>, <code>computeDefaultImageRect</code> insets the drawing area by ~11% of
          the shorter side, leaving a clean border; when <code>true</code> the image runs edge-to-edge.
          The fit mode then governs how the image fills <em>that</em> area — so{' '}
          <code>cover</code> + <code>fullBleed</code> gives a true bleed photo, while{' '}
          <code>contain</code> always shows the whole image.
        </p>
        <p>
          These are the building blocks behind{' '}
          <Link href="/textures/page-textures/">createPageTexture / createPageCanvas</Link>, which call{' '}
          <code>drawImageWithFit</code> internally. Use them directly only when you need finer control
          over the canvas — for instance an editor that lets the reader drag and resize the image, in
          which case you would seed an <code>ImageRect</code> from{' '}
          <code>computeDefaultImageRect</code> and mutate it.
        </p>
      </Notes>
    </ExportPage>
  )
}
