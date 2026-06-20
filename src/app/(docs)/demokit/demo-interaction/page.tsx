import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/demokit/demo-interaction/')!

const CODE = `import { createDemoScene, createDemoInteraction } from '@objectifthunes/three-book/demo-kit'

const ds = createDemoScene()

// Wire pointer page-turning to every live Book, and pause orbit
// controls for the duration of a drag so a turn never fights the camera.
const interaction = createDemoInteraction(
  ds.camera,
  ds.renderer.domElement,
  ds.controls,
  true, // start enabled
)

// Toggle turning on/off at runtime:
function setInteractive(on: boolean) {
  interaction.enabled = on
}

// Under the hood, createDemoInteraction does roughly:
//   const i = new BookPointerInteraction(camera, domElement)
//   i.enabled = enabled
//   i.onTurnStart = () => { controls.enabled = false }
//   i.onTurnEnd   = () => { controls.enabled = true }`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="ARGUMENTS"
        cols={['Argument', 'Type', '', 'Purpose']}
        rows={[
          { name: 'camera', type: 'THREE.PerspectiveCamera', desc: 'The camera used to cast pointer rays at the book — pass ds.camera from createDemoScene.' },
          { name: 'domElement', type: 'HTMLElement', desc: 'The element that receives pointer events, normally renderer.domElement.' },
          { name: 'controls', type: 'OrbitControls', desc: 'The orbit controls to disable while a page is being dragged and re-enable when the turn ends.' },
          { name: 'enabled', type: 'boolean', desc: 'Initial enabled state. Flip interaction.enabled later to toggle turning at runtime.' },
        ]}
      />
      <PropTable
        label="RETURNS"
        cols={['Member', 'Type', '', 'Meaning']}
        rows={[
          { name: 'interaction', type: 'BookPointerInteraction', desc: 'The configured interaction instance. Its onTurnStart / onTurnEnd handlers are already wired to toggle the passed controls.' },
          { name: 'interaction.enabled', type: 'boolean', desc: 'Read or write to turn pointer page-turning on or off.' },
        ]}
      />
      <Notes>
        <p>
          <code>createDemoInteraction</code> is a thin convenience wrapper over{' '}
          <Link href="/turning/interaction/">BookPointerInteraction</Link>. The only extra value it adds is the
          two-line dance every demo needs: disable <code>OrbitControls</code> on{' '}
          <code>onTurnStart</code> and re-enable on <code>onTurnEnd</code>, so dragging a page never also drags
          the camera.
        </p>
        <p>
          It hooks the live <code>Book.instances</code>, so add your book to the scene and call its{' '}
          <code>init()</code> before (or after) wiring interaction — no per-book registration is needed.
        </p>
        <p>
          For the full pointer API — events, raycasting, and turning thresholds — see{' '}
          <Link href="/turning/interaction/">Interactive turning</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
