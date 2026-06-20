import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/reference/performance/')!

const CODE = `import { Book, BookContent, StapleBookBinding } from '@objectifthunes/three-book'

// Set the flags up front in BookOptions…
const book = new Book({
  content: new BookContent(),
  binding: new StapleBookBinding(),
  castShadows: true,
  reduceShadows: true,    // fewer papers cast/receive shadows
  reduceSubMeshes: true,  // merge sub-meshes → fewer draw calls
  reduceOverdraw: true,   // cut hidden fill behind the visible spread
  hideBinder: false,
})
book.init()

// …or flip them at runtime — each setter rebuilds the affected geometry:
book.reduceShadows = true
book.castShadows = false`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="PERFORMANCE FLAGS"
        cols={['Flag', 'Type', 'Default', 'What it does / trades']}
        rows={[
          { name: 'castShadows', type: 'boolean', def: 'true', desc: 'Whether papers cast shadows at all. Turning it off removes the book from the shadow pass entirely — the biggest single win on shadow-bound scenes, at the cost of grounding realism.' },
          { name: 'reduceShadows', type: 'boolean', def: 'false', desc: 'Limits how many papers participate in shadows (rather than killing shadows outright). Trades subtle shadow accuracy on the inner stack for a cheaper shadow pass — a good middle ground when castShadows: false looks too flat.' },
          { name: 'reduceSubMeshes', type: 'boolean', def: 'false', desc: 'Merges per-paper sub-meshes so the book draws in fewer draw calls. Trades a little material/UV flexibility for lower CPU draw-call overhead.' },
          { name: 'reduceOverdraw', type: 'boolean', def: 'false', desc: 'Skips drawing the page area hidden behind the visible spread (cutting fill-rate / overdraw). Trades extra build-time geometry work for cheaper per-pixel cost — helps most on fill-bound mobile GPUs.' },
          { name: 'hideBinder', type: 'boolean', def: 'false', desc: 'Hides the binder/spine geometry. Mostly a visual choice, but also removes those meshes from every pass.' },
        ]}
      />
      <Notes>
        <p>
          All five are settable both in <Link href="/book/book-options/">BookOptions</Link> at construction and
          as live properties on the <Link href="/book/book-class/">Book</Link> instance. Writing a flag marks
          the structure dirty, so the affected geometry rebuilds on the next update — set them in bursts rather
          than every frame.
        </p>
        <p>
          <strong>On low-end / mobile devices</strong>, reach for them in roughly this order: start with{' '}
          <code>reduceOverdraw</code> (cheap to enable, helps fill-bound GPUs), add{' '}
          <code>reduceSubMeshes</code> if you are draw-call bound (many books or thick stacks), then{' '}
          <code>reduceShadows</code> — and only drop to <code>castShadows: false</code> if shadows are still the
          bottleneck.
        </p>
        <p>
          <strong>BookHeightException</strong> is thrown when the paper stack exceeds the maximum allowed
          height. It is a structural limit, not a performance flag: resolve it by reducing page count, using
          thinner paper (lower <code>thickness</code> in the page{' '}
          <Link href="/binding/paper-setup/">PaperSetup</Link>), or widening the paper — not by toggling the
          flags above.
        </p>
      </Notes>
    </ExportPage>
  )
}
