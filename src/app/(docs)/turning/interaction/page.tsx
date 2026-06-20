import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { FullScreenPreview } from '@/components/Preview'
import { findExport } from '@/components/exports'
import { BookOpen } from 'lucide-react'

const e = findExport('/turning/interaction/')!

const CODE = `import { BookPointerInteraction } from '@objectifthunes/three-book'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)

// Wire pointer drag to the nearest book's turning API.
const interaction = new BookPointerInteraction(camera, renderer.domElement)

// Pause orbiting while a page is being dragged, resume when it's released.
interaction.onTurnStart = (book) => { controls.enabled = false }
interaction.onTurnEnd   = (book) => { controls.enabled = true  }

// Temporarily disable without tearing down the listeners:
// interaction.enabled = false

// On unmount, remove the DOM listeners:
// interaction.dispose()`

const DEMOKIT = `// The demo-kit wraps exactly this pattern in one call:
import { createDemoInteraction } from '@objectifthunes/three-book/demo-kit'

const interaction = createDemoInteraction(
  camera,
  renderer.domElement,
  controls,        // an OrbitControls instance
  true,            // initial enabled flag
)
// internally: new BookPointerInteraction(...), then onTurnStart/onTurnEnd
// toggle controls.enabled for you.`

const LOWLEVEL = `import * as THREE from 'three'

// Lower level: drive turning yourself from a custom THREE.Ray.
const ray = new THREE.Ray(/* origin */, /* direction */)

if (book.startTurning(ray)) {   // grabs the page under the ray, if any
  // on each move:
  book.updateTurning(ray)
  // on release:
  book.stopTurning()
}`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="BookPointerInteraction"
        cols={['Member', 'Type', '', 'What it does']}
        rows={[
          { name: 'constructor', type: '(camera: THREE.Camera, domElement: HTMLElement)', desc: 'Attaches pointer-down / move / up listeners to domElement and raycasts from camera to find the book under the pointer.' },
          { name: 'enabled', type: 'boolean', def: 'true', desc: 'Set to false to suspend interaction without disposing the listeners.' },
          { name: 'onTurnStart', type: '(book: Book) => void', def: 'undefined', desc: 'Called when a drag begins turning a page. The usual place to disable OrbitControls.' },
          { name: 'onTurnEnd', type: '(book: Book) => void', def: 'undefined', desc: 'Called when the drag ends and the page is released. The usual place to re-enable OrbitControls.' },
          { name: 'dispose', type: '() => void', desc: 'Removes the pointer event listeners. Call it on unmount.' },
        ]}
      />
      <PropTable
        label="LOW-LEVEL Book METHODS"
        cols={['Method', 'Signature', '', 'What it does']}
        rows={[
          { name: 'startTurning', type: '(ray: THREE.Ray) => boolean', desc: 'Begins turning the page hit by the ray. Returns true if a page was grabbed.' },
          { name: 'updateTurning', type: '(ray: THREE.Ray) => void', desc: 'Updates the in-progress turn to follow the ray. Call each move while dragging.' },
          { name: 'stopTurning', type: '() => void', desc: 'Releases the page so it falls / settles into place.' },
        ]}
      />
      <Notes>
        <p>
          <code>BookPointerInteraction</code> is the turnkey input layer: hand it a camera and the
          canvas element and it raycasts pointer drags onto the nearest book for you. The one wiring
          you almost always want is pausing <code>OrbitControls</code> during a turn — set{' '}
          <code>controls.enabled = false</code> in <code>onTurnStart</code> and back to{' '}
          <code>true</code> in <code>onTurnEnd</code>. The demo-kit&apos;s{' '}
          <code>createDemoInteraction</code> does precisely this:
        </p>
        <Source code={DEMOKIT} lang="ts" />
        <p>
          If you raycast yourself — a custom picker, an XR controller, a scripted gesture — skip the
          pointer class and call <code>book.startTurning(ray)</code>,{' '}
          <code>updateTurning(ray)</code> and <code>stopTurning()</code> directly with your own{' '}
          <code>THREE.Ray</code>:
        </p>
        <Source code={LOWLEVEL} lang="ts" />
        <p>
          For turns triggered in code rather than by the pointer, see{' '}
          <Link href="/turning/auto-turn/">Auto-turning</Link>, and to read whether a turn is in
          flight see <Link href="/book/state/">Reading state</Link>.
        </p>
      </Notes>
      <FullScreenPreview href="/full/editor/" illustration={<BookOpen size={40} strokeWidth={1.25} />} />
    </ExportPage>
  )
}
