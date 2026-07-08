import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveBinding } from '@/components/live/examples'

const e = findExport('/binding/binding/')!

const CODE = `import { Book, StapleBookBinding } from '@objectifthunes/three-book'

// The built-in spine: stapled sheets. This is all most books ever need.
const book = new Book({
  content,
  binding: new StapleBookBinding(),
  // hideBinder: true,   // build the binding but hide the staple meshes
})

// ── Writing a custom spine (advanced) ───────────────────────────────────────
// Extend BookBinding and return your own BookBound from createBound().
import {
  BookBinding,
  BookBound,
  type RendererFactory,
  type MeshFactory,
} from '@objectifthunes/three-book'
import * as THREE from 'three'

class GlueBinding extends BookBinding {
  createBound(
    book: Book,
    root: THREE.Object3D,
    rendererFactory: RendererFactory,
    meshFactory: MeshFactory,
  ): BookBound {
    return new GlueBound(book, root /*, …*/)
  }
}

// new Book({ content, binding: new GlueBinding() })`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveBinding />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="BINDING TYPES"
        cols={['Type', 'Kind', '', 'Role']}
        rows={[
          { name: 'StapleBookBinding', type: 'class', desc: 'The magazine spine: folded sheets with visible staples. Construct with new StapleBookBinding() and pass as binding. No setup required.' },
          { name: 'GluedBookBinding', type: 'class', desc: 'The premium case-bound spine: rigid boards, one smooth cover shell, pages glued to the spine. See its dedicated page for GluedSetup.' },
          { name: 'BookBinding', type: 'abstract', desc: 'The base contract: a single createBound(book, root, rendererFactory, meshFactory) factory method. Extend it to author a custom spine.' },
          { name: 'BookBound', type: 'abstract', desc: 'The runtime instance returned by createBound — it positions papers each frame and owns the binder geometry. Subclass it alongside a custom BookBinding.' },
        ]}
      />
      <Notes>
        <p>
          Almost everyone wants <code>new StapleBookBinding()</code>. Pass it as the{' '}
          <Link href="/book/book-options/">BookOptions</Link> <code>binding</code> field and the book
          renders stapled sheets at the spine. The{' '}
          <code>hideBinder</code> option still builds the binding (so the geometry and page
          positioning are correct) but hides the staple meshes — useful when you want a clean spine or
          plan to draw your own.
        </p>
        <p>
          <code>BookBinding</code> and <code>BookBound</code> are the abstraction beneath it.{' '}
          <code>BookBinding</code> is a tiny factory: its only job is <code>createBound(…)</code>,
          which returns a <code>BookBound</code> — the live object that lays out papers and manages the
          binder renderer. To invent a different spine (glued, sewn, ring) you subclass both. This is
          rarely needed; reach for it only when the staple look genuinely will not do.
        </p>
      </Notes>
    </ExportPage>
  )
}
