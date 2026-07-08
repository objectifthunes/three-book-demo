import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Notes } from '@/components/Notes'
import { findExport } from '@/components/exports'
import { Playground } from '@/components/live/playground'

const e = findExport('/play/staple/')!

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Playground kind="staple" />
      <Notes>
        <p>
          Everything on this canvas is the real library — <code>StapleBookBinding</code>, paper
          setups, auto-turning and text overlays wired to the controls. Type in the{' '}
          <strong>headline</strong> field and watch it land on page 1: that is{' '}
          <code>TextOverlayContent</code> compositing live, the same mechanism you would use for a
          WYSIWYG editor.
        </p>
        <p>
          The hardcover twin lives in the{' '}
          <Link href="/play/hardcover/">Hardcover playground</Link>. For the API behind each
          control, every docs page links back here.
        </p>
      </Notes>
    </ExportPage>
  )
}
