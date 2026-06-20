import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveBook } from '@/components/live/examples'

const e = findExport('/book/lifecycle/')!

const CODE = `import { Book, BookContent, StapleBookBinding } from '@objectifthunes/three-book'
import * as THREE from 'three'

let book: Book | null = null
let raf = 0
const clock = new THREE.Clock()

// MOUNT — construct, build geometry once, add to the scene.
function mount(scene: THREE.Scene) {
  book = new Book({
    content: new BookContent(),
    binding: new StapleBookBinding(),
  })
  book.init()       // builds the papers; call exactly once, after construction
  scene.add(book)   // Book is a THREE.Object3D
  raf = requestAnimationFrame(animate)
}

// ANIMATE — tick every frame with the delta time in SECONDS.
function animate() {
  raf = requestAnimationFrame(animate)
  const dt = clock.getDelta()
  book?.update(dt)  // advances turning + settle physics; nothing moves without it
  renderer.render(scene, camera)
}

// UNMOUNT — stop the loop, then dispose. dispose() is MANDATORY.
function unmount(scene: THREE.Scene) {
  cancelAnimationFrame(raf)
  if (book) {
    scene.remove(book)
    book.dispose()  // frees GPU memory + drops the book from Book.instances
    book = null
  }
}`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveBook />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="LIFECYCLE METHODS"
        cols={['Method', 'Signature', 'When', 'What it does']}
        rows={[
          { name: 'init', type: '() => void', def: 'once, after construction', desc: 'Builds the geometry from content + binding and creates the papers. Call it once before the first update(), after adding the book to your scene. With buildOnAwake the build happens internally, but calling init() is the explicit path.' },
          { name: 'update', type: '(dt: number) => void', def: 'every frame', desc: 'Advances page-turn and settle (falling) physics by dt seconds. Must run every frame, even when idle, so in-flight turns and auto-turns complete.' },
          { name: 'dispose', type: '() => void', def: 'on unmount', desc: 'MANDATORY. Releases geometries, materials and textures, and removes the book from the static Book.instances list. Skipping it leaks GPU memory and the book is never garbage collected.' },
          { name: 'build', type: '(internal)', def: '—', desc: 'The internal geometry builder invoked by init() / buildOnAwake. You normally do not call it directly — use init().' },
        ]}
      />
      <Notes>
        <p>
          The contract is small but strict: <code>init()</code> exactly once,{' '}
          <code>update(dt)</code> every frame with the delta in <em>seconds</em>, and{' '}
          <code>dispose()</code> on teardown. The delta unit matters — passing milliseconds makes
          turns fly by; use <code>THREE.Clock.getDelta()</code> or your own seconds value.
        </p>
        <p>
          <strong>Disposing is not optional.</strong> A live <code>Book</code> keeps a reference in
          the static <code>Book.instances</code> set, so without <code>dispose()</code> it can never
          be collected and its GPU resources leak — a real hazard in single-page apps that mount and
          unmount the canvas. See <Link href="/book/state/">Reading state</Link> for{' '}
          <code>isBuilt</code> and the rest of the read-only surface, and{' '}
          <Link href="/book/book-options/">BookOptions</Link> for <code>buildOnAwake</code>.
        </p>
      </Notes>
    </ExportPage>
  )
}
