import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/reference/types/')!

const CODE = `import type {
  BookOptions,
  PaperSetupInit,
  IPageContent,
  BookRaycastHit,
  ImageFitMode,
  ImageRect,
  LoadedImage,
  TextBlockOptions,
} from '@objectifthunes/three-book'
import { BookContent, AutoTurnSettings } from '@objectifthunes/three-book'`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="TYPES"
        cols={['Type', 'Kind', '', 'Used by / link']}
        rows={[
          { name: 'BookOptions', type: 'interface', desc: 'Constructor options for Book — see Book options.' },
          { name: 'PaperSetupInit', type: 'interface', desc: 'Per-paper geometry (size, thickness, stiffness, material) — see PaperSetup.' },
          { name: 'BookContent', type: 'class', desc: 'Holds covers + pages and the reading direction — see BookContent.' },
          { name: 'IPageContent', type: 'interface', desc: 'Contract for one page surface — see Page content types.' },
          { name: 'BookRaycastHit', type: 'interface', desc: 'Hit result from pointer raycasts: { point, textureCoordinate, pageContent, paperIndex, pageIndex } — see Interactive turning.' },
          { name: 'ImageFitMode', type: "'contain'|'cover'|'fill'", desc: 'How an image scales into its area — see Images & fit.' },
          { name: 'ImageRect', type: 'interface', desc: 'Image position + size in canvas pixels ({ x, y, width, height }) — see Images & fit.' },
          { name: 'LoadedImage', type: 'interface', desc: 'Result of loadImage(): { image, objectUrl } — see Images & fit.' },
          { name: 'TextBlockOptions', type: 'interface', desc: 'Styling options for a TextBlock — see TextBlock.' },
          { name: 'AutoTurnSettings', type: 'class', desc: 'Timing / mode bundle for programmatic turns — see Auto-turning.' },
        ]}
      />
      <Notes>
        <p>
          This is a navigational map — each type is documented in full where it is used:
        </p>
        <p>
          <Link href="/book/book-options/">BookOptions</Link> ·{' '}
          <Link href="/binding/paper-setup/">PaperSetupInit</Link> ·{' '}
          <Link href="/content/book-content/">BookContent</Link> ·{' '}
          <Link href="/content/page-content/">IPageContent</Link> ·{' '}
          <Link href="/turning/interaction/">BookRaycastHit</Link> ·{' '}
          <Link href="/textures/images/">ImageFitMode, ImageRect &amp; LoadedImage</Link> ·{' '}
          <Link href="/content/text-block/">TextBlockOptions</Link> ·{' '}
          <Link href="/turning/auto-turn/">AutoTurnSettings</Link>.
        </p>
        <p>
          For the numeric enums (<code>BookDirection</code>, <code>AutoTurnMode</code>, and friends), see the{' '}
          <Link href="/reference/enums/">Enums</Link> reference.
        </p>
      </Notes>
    </ExportPage>
  )
}
