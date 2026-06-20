import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { findExport } from '@/components/exports'
import { LiveGeometry } from '@/components/live/examples'

const e = findExport('/start/playground/')!

const CODE = `const book = new Book({
  content,
  binding: new StapleBookBinding(),
  initialOpenProgress: 0.5,
  pagePaperSetup: { width: 2, height: 3, thickness, stiffness, color: new THREE.Color(1, 1, 1), material: null },
  coverPaperSetup: { width: 2.1, height: 3.1, thickness: 0.04, stiffness: 0.5, color: new THREE.Color(1, 1, 1), material: null },
})`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveGeometry />
      <Source code={CODE} lang="ts" />
      <Notes>
        <p>
          Every control here rebuilds a real <code>Book</code> with new <a href="/book/book-options/">BookOptions</a>:
          the page count changes the content, <code>thickness</code> and <code>stiffness</code> feed the{' '}
          <code>pagePaperSetup</code>, and the colours are baked into the page textures. Drag a page to feel how the
          stiffness changes the curl.
        </p>
        <p>
          This whole example runs inline on a single contained <code>WebGLRenderer</code> — the same primitive every
          live example on this site uses.
        </p>
      </Notes>
    </ExportPage>
  )
}
