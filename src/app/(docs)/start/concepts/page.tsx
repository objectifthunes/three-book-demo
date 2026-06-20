import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/start/concepts/')!

const CODE = `import { Book, BookContent, StapleBookBinding } from '@objectifthunes/three-book'

// 1. CONTENT — what each surface shows. Covers first, then pages.
//    Each entry is a THREE.Texture or an IPageContent (live, per-frame content).
const content = new BookContent()
content.covers = [frontCoverTexture, backCoverTexture]
content.pages  = [page1Texture, page2Texture, page3Texture, page4Texture]

// 2. BINDING — how the sheets are attached at the spine.
const binding = new StapleBookBinding()

// 3. BOOK — owns a stack of Papers built from content + binding.
const book = new Book({ content, binding, initialOpenProgress: 0 })
book.init()          // build the geometry once
scene.add(book)      // Book is a THREE.Object3D

// 4. THE LOOP — drive the turn / settle simulation every frame.
function animate(dt: number) {
  book.update(dt)    // dt = seconds since last frame
  // book.openProgress is the live 0…1 open state
}`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="THE PIECES"
        cols={['Piece', 'Type', '', 'Role']}
        rows={[
          { name: 'Book', type: 'class (THREE.Group)', desc: 'The master controller. Owns a stack of Papers, the binding, and the turn/settle simulation. You add it to your scene and tick it.' },
          { name: 'Paper', type: 'class', desc: 'One physical sheet. Covers come first in the stack, then pages. Each Paper carries two surfaces (front / back) and its own turn state.' },
          { name: 'BookContent', type: 'class', desc: 'Supplies what every surface shows — a THREE.Texture or an IPageContent per cover and per page, plus the reading direction.' },
          { name: 'BookBinding', type: 'abstract class', desc: 'Decides how the papers are attached at the spine. StapleBookBinding is the ready-made implementation.' },
          { name: 'demo-kit', type: 'subpath import', desc: 'Optional batteries-included helpers (scene, interaction, panel) imported from @objectifthunes/three-book/demo-kit. Not needed for production use.' },
        ]}
      />
      <Notes>
        <p>
          A book is a <strong>stack of papers</strong>. The covers are added first, then the inner
          pages — so <code>papers[0]</code> is always the front cover. A{' '}
          <Link href="/content/book-content/">BookContent</Link> supplies the texture (or live{' '}
          <Link href="/content/page-content/">IPageContent</Link>) for each surface, and a{' '}
          <Link href="/binding/binding/">BookBinding</Link> attaches them at the spine when{' '}
          <code>init()</code> runs.
        </p>
        <p>
          Nothing animates on its own. You call <code>update(dt)</code> every frame with the delta
          time in seconds, and that single tick advances the page-turn and settle physics. Read{' '}
          <code>book.openProgress</code> — a number from 0 (closed) to 1 (open at the back) — to know
          where the book currently sits. From here, see the{' '}
          <Link href="/book/book-class/">Book class</Link>, the{' '}
          <Link href="/book/lifecycle/">lifecycle</Link>, and how to{' '}
          <Link href="/turning/interaction/">turn pages</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
