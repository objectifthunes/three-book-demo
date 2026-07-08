import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/demokit/overview/')!

const CODE = `import { Book } from '@objectifthunes/three-book'
import '@objectifthunes/three-book/demo.css'
import {
  createDemoScene,
  createDemoInteraction,
  createDemoPanel,
  addSlider,
  createImageSlotCard,
  createImageSlot,
} from '@objectifthunes/three-book/demo-kit'

// 1. A ready-made scene: camera, renderer, lights, ground, OrbitControls
const ds = createDemoScene()

// 2. A book
const book = new Book(/* ... */)
book.init()
ds.scene.add(book)

// 3. Pointer page-turning, wired to pause orbit while dragging
const interaction = createDemoInteraction(
  ds.camera,
  ds.renderer.domElement,
  ds.controls,
  true,
)

// 4. A floating, tabbed control panel
const tab = document.createElement('div')
addSlider(tab, 'Sun', 0, 3, 0.1, 1.2, (v) => {
  ds.syncLights({ ambientIntensity: 0.6, sunIntensity: v, sunX: 5, sunY: 10, sunZ: 5 })
})
const panel = createDemoPanel({
  title: 'three-book demo',
  subtitle: 'Drag to turn',
  tabs: [{ key: 'book', label: 'Book', content: tab }],
})

// 5. Render loop
const clock = new THREE.Clock()
function animate() {
  const dt = clock.getDelta()
  book.update(dt)
  ds.controls.update()
  ds.renderer.render(ds.scene, ds.camera)
  requestAnimationFrame(animate)
}
animate()`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="WHAT'S INSIDE"
        cols={['Helper', 'Group', '', 'One-liner']}
        rows={[
          { name: 'createDemoScene', type: 'Scene', desc: 'A whole Three.js scene — camera, WebGLRenderer, ambient + directional light, ground plane and OrbitControls — in one call.' },
          { name: 'createDemoInteraction', type: 'Interaction', desc: 'Pointer page-turning wired to the live Book(s), pausing OrbitControls while a page is being dragged.' },
          { name: 'createDemoPanel', type: 'Panel', desc: 'The floating, collapsible, tabbed control panel that hosts your form controls.' },
          { name: 'addSlider / addColor / addCheckbox / addSelect', type: 'Controls', desc: 'DOM form-control builders that append a styled, labelled input to a container and report changes via a callback.' },
          { name: 'addSectionTitle / addCollapseToggle', type: 'Controls', desc: 'Layout helpers: a section heading, and a collapsible header + body pair for grouping controls.' },
          { name: 'createPageNavigation / resolvePageIndex', type: 'Nav', desc: 'A prev / page-number / next navigator with a double-page spread toggle, plus the index-resolution helper behind it.' },
          { name: 'createImageSlotCard / createImageSlot', type: 'Images', desc: 'An upload card with thumbnail, fit-mode and bleed controls, backed by a plain ImageSlot state object.' },
          { name: 'clearImageSlot / loadImageFromFile', type: 'Images', desc: 'Reset a slot (revoking its object URL) or load a File into one.' },
          { name: 'createPageTexture / drawImageWithFit / loadImage', type: 'Textures', desc: 'Re-exported texture utilities from the main library for turning colours, text and images into page textures.' },
        ]}
      />
      <Notes>
        <p>
          <code>/demo-kit</code> is an <em>optional</em>, batteries-included layer that sits on top of{' '}
          <code>@objectifthunes/three-book</code>. None of it is needed to render a book — but it is exactly
          what powers this site&apos;s <Link href="/start/playground/">playground</Link>, so it gets you from zero
          to an interactive demo in a handful of lines.
        </p>
        <p>
          Everything here is browser-only and styled by{' '}
          <code>@objectifthunes/three-book/demo.css</code>. Import it once and the panel, sliders, cards and
          navigator pick up their look automatically.
        </p>
        <p>
          Drill into each helper:{' '}
          <Link href="/demokit/demo-scene/">createDemoScene</Link>,{' '}
          <Link href="/demokit/demo-interaction/">createDemoInteraction</Link>, and{' '}
          <Link href="/demokit/demo-panel/">createDemoPanel &amp; the control builders</Link>. The texture
          helpers are documented under <Link href="/textures/page-textures/">Page textures</Link> and{' '}
          <Link href="/textures/images/">Images &amp; fit</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
