import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Notes } from '@/components/Notes'
import { findExport } from '@/components/exports'
import { Playground } from '@/components/live/playground'

const e = findExport('/play/hardcover/')!

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Playground kind="glued" />
      <Notes>
        <p>
          The full <code>GluedBookBinding</code> surface, live: rigid boards, the hinge and gutter
          flex zones, the spine colour — and two WYSIWYG fields. The <strong>headline</strong> types
          straight onto page 1 via <code>TextOverlayContent</code>; the <strong>spine title</strong>{' '}
          renders a canvas texture down the case spine via <code>setup.spineTexture</code>.
        </p>
        <p>
          The magazine twin lives in the <Link href="/play/staple/">Staple playground</Link>. For
          the API behind each control, every docs page links back here.
        </p>
      </Notes>
    </ExportPage>
  )
}
