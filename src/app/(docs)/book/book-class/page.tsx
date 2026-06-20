import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/book/book-class/')!

const CODE = `import { Book, BookContent, StapleBookBinding } from '@objectifthunes/three-book'

const book = new Book({
  content: new BookContent(),
  binding: new StapleBookBinding(),
  initialOpenProgress: 0.5,
})

book.init()        // build geometry; call once, after construction
scene.add(book)    // Book is a THREE.Object3D

// every frame:
book.update(dt)    // advance turning / falling animations

// when you're done:
book.dispose()     // release GPU resources + leave Book.instances`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="KEY METHODS"
        cols={['Method', 'Signature', '', 'What it does']}
        rows={[
          { name: 'init', type: '() => void', desc: 'Builds the book geometry from its content + binding. Call once after construction, before the first update.' },
          { name: 'update', type: '(dt: number) => void', desc: 'Advances page-turn and settle animations. Call every frame with the delta time in seconds.' },
          { name: 'dispose', type: '() => void', desc: 'Releases geometries, materials and textures and removes the book from Book.instances. Mandatory — skipping it leaks GPU memory.' },
          { name: 'setOpenProgress', type: '(t: number) => void', desc: 'Jump to an open state in 0…1 without animating. See Open progress.' },
          { name: 'startAutoTurning', type: '(dir, settings, count?, delay?) => boolean', desc: 'Animate one or more page turns programmatically. See Auto-turning.' },
        ]}
      />
      <PropTable
        label="KEY PROPERTIES"
        cols={['Property', 'Type', '', 'Meaning']}
        rows={[
          { name: 'papers', type: 'Paper[]', desc: 'The live sheets, covers first. Each Paper exposes its index and turn state.' },
          { name: 'paperCount', type: 'number', desc: 'Total sheet count (covers + pages).' },
          { name: 'openProgress', type: 'number', desc: 'Current open state, 0 (closed) … 1 (fully open at the back).' },
          { name: 'isBuilt', type: 'boolean', desc: 'True once init() has produced geometry.' },
          { name: 'content', type: 'BookContent', desc: 'Settable — assign a new BookContent to rebuild pages in place.' },
          { name: 'Book.instances', type: 'static Book[]', desc: 'Every live book. Handy for a single update / dispose sweep in your loop.' },
        ]}
      />
      <Notes>
        <p>
          <code>Book</code> is the one class you always touch. It owns the papers, the binding, and the
          turn/settle simulation; you own the scene, the camera, and the render loop that calls{' '}
          <code>update(dt)</code>.
        </p>
        <p>
          Construction is configured entirely through <Link href="/book/book-options/">BookOptions</Link>. The
          lifecycle — <code>init()</code>, <code>update()</code>, <code>dispose()</code> — has its own{' '}
          <Link href="/book/lifecycle/">page</Link>, and the full read-only surface is covered under{' '}
          <Link href="/book/state/">Reading state</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
