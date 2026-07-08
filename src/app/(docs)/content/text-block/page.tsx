import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/content/text-block/')!

const CODE = `import { TextBlock, TextOverlayContent } from '@objectifthunes/three-book'

// Usually you create blocks through an overlay or spread — addText() returns
// the TextBlock so you can keep editing it:
const title = overlay.addText({
  text: 'Chapter One',
  x: 60,
  y: 80,
  width: 480,
  fontFamily: 'Georgia',
  fontSize: 48,
  fontWeight: 'bold',
  fontStyle: 'italic',
  color: '#1a1a1a',
  lineHeight: 1.3,
  textAlign: 'center',
  textTransform: 'uppercase',
  textDecoration: 'underline',
  shadowColor: 'rgba(0,0,0,0.4)',
  shadowBlur: 8,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  background: 'rgba(255,255,255,0.6)',
  backgroundPadding: 12,
  maxLines: 2,
  height: 160,
  verticalAlign: 'middle',
  rotation: -0.05, // radians
})

// Mutate fields directly — they are public — then re-composite:
title.opacity = 0.9
overlay.markDirty()
overlay.update(book)

// Or construct one standalone (e.g. to measure before placing):
const note = new TextBlock({ text: 'Lorem ipsum', width: 300, fontSize: 18 })
const h = note.measureHeight(ctx) // total rendered height in px`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="TEXTBLOCKOPTIONS"
        rows={[
          { name: 'x', type: 'number', def: '0', desc: 'Left edge of the text box, in canvas pixels.' },
          { name: 'y', type: 'number', def: '0', desc: 'Top edge of the text box, in canvas pixels.' },
          { name: 'width', type: 'number', def: '0', desc: 'Max width before word-wrapping. 0 disables wrapping.' },
          { name: 'text', type: 'string', def: "''", desc: 'The text content. Explicit \\n newlines are respected.' },
          { name: 'fontFamily', type: 'string', def: "'Georgia'", desc: 'CSS font family.' },
          { name: 'fontSize', type: 'number', def: '24', desc: 'Font size in canvas pixels.' },
          { name: 'fontWeight', type: "'normal' | 'bold'", def: "'normal'", desc: 'Font weight.' },
          { name: 'fontStyle', type: "'normal' | 'italic'", def: "'normal'", desc: 'Font style.' },
          { name: 'color', type: 'string', def: "'#222'", desc: 'CSS fill colour for the glyphs.' },
          { name: 'lineHeight', type: 'number', def: '1.4', desc: 'Line-height multiplier of the font size.' },
          { name: 'textAlign', type: "'left' | 'center' | 'right'", def: "'left'", desc: 'Horizontal alignment within the box width.' },
          { name: 'opacity', type: 'number', def: '1', desc: 'Alpha 0–1. 0 skips drawing entirely.' },
          { name: 'shadowColor', type: 'string', def: "''", desc: 'CSS shadow colour; only applied when shadowBlur > 0.' },
          { name: 'shadowBlur', type: 'number', def: '0', desc: 'Shadow blur radius in pixels.' },
          { name: 'shadowOffsetX', type: 'number', def: '0', desc: 'Horizontal shadow offset in pixels.' },
          { name: 'shadowOffsetY', type: 'number', def: '0', desc: 'Vertical shadow offset in pixels.' },
          { name: 'textTransform', type: "'none' | 'uppercase' | 'lowercase' | 'capitalize'", def: "'none'", desc: 'Case transformation applied before wrapping.' },
          { name: 'textDecoration', type: "'none' | 'underline' | 'strikethrough'", def: "'none'", desc: 'Line decoration, stroked per line (shadow disabled for the rule).' },
          { name: 'background', type: 'string', def: "''", desc: 'CSS fill drawn as a box behind the text. Empty = none.' },
          { name: 'backgroundPadding', type: 'number', def: '0', desc: 'Padding around the text for the background box, in pixels.' },
          { name: 'maxLines', type: 'number', def: '0', desc: 'Clamp to N lines, truncating the last with an ellipsis. 0 = unlimited.' },
          { name: 'height', type: 'number', def: '0', desc: 'Container height for vertical alignment. 0 = auto-fit to text.' },
          { name: 'verticalAlign', type: "'top' | 'middle' | 'bottom'", def: "'top'", desc: 'Vertical alignment within height (only matters when height > 0).' },
          { name: 'rotation', type: 'number', def: '0', desc: 'Rotation in radians around the block centre.' },
        ]}
      />
      <PropTable
        label="METHODS"
        cols={['Method', 'Signature', '', 'What it does']}
        rows={[
          { name: 'measureHeight', type: '(ctx: CanvasRenderingContext2D) => number', desc: 'Total rendered height in pixels, after wrapping and maxLines clamping. Handy for laying blocks out sequentially.' },
          { name: 'wrapLines', type: '(ctx) => string[]', desc: 'The wrapped lines that would be drawn — applies textTransform, width wrapping and maxLines.' },
          { name: 'hitTest', type: '(ctx, px, py) => boolean', desc: 'True if a canvas-space point falls in the (axis-aligned) bounding box. Rotation is not accounted for.' },
          { name: 'draw', type: '(ctx) => void', desc: 'Paint the block onto a 2D context — overlays/spreads call this for you in update().' },
        ]}
      />
      <Notes>
        <p>
          A <code>TextBlock</code> is the styled-text primitive. Every option is also a public field on the
          instance, so you can either pass <code>TextBlockOptions</code> up front or mutate properties
          afterwards and re-draw. You almost always create one via{' '}
          <Link href="/content/text-overlay/">TextOverlayContent.addText</Link> or{' '}
          <Link href="/content/spreads/">SpreadContent.addText</Link>, which return the block and own the
          canvas it draws onto.
        </p>
        <p>
          Coordinates are in canvas pixels relative to the overlay (or spread) canvas, so size your text to the
          same <code>width</code>/<code>height</code> you gave that content. After changing a block, call the
          owner&apos;s <code>update()</code> (or <code>markDirty()</code>) so it recomposites. Use{' '}
          <code>measureHeight(ctx)</code> when stacking blocks to compute the next <code>y</code>.
        </p>
      </Notes>
    </ExportPage>
  )
}
