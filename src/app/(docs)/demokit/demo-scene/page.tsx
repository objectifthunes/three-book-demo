import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveBook } from '@/components/live/examples'

const e = findExport('/demokit/demo-scene/')!

const CODE = `import * as THREE from 'three'
import { Book, BookContent, StapleBookBinding } from '@objectifthunes/three-book'
import { createDemoScene } from '@objectifthunes/three-book/demo-kit'

// One call builds the whole scene and appends a full-window canvas to <body>.
const ds = createDemoScene()

// Use it as the base for a book:
const book = new Book({
  content: new BookContent(),
  binding: new StapleBookBinding(),
})
book.init()
ds.scene.add(book)

// Drive the lights from your own UI state:
ds.syncLights({
  ambientIntensity: 0.6,
  sunIntensity: 1.2,
  sunX: 5,
  sunY: 10,
  sunZ: 5,
})

// Render loop:
const clock = new THREE.Clock()
function animate() {
  const dt = clock.getDelta()
  book.update(dt)
  ds.controls.update()            // OrbitControls (damped)
  ds.renderer.render(ds.scene, ds.camera)
  requestAnimationFrame(animate)
}
animate()`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveBook />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="RETURNS — DemoScene"
        cols={['Property', 'Type', '', 'What it is']}
        rows={[
          { name: 'scene', type: 'THREE.Scene', desc: 'The scene, pre-populated with the lights and a ground plane. Add your book to it.' },
          { name: 'camera', type: 'THREE.PerspectiveCamera', desc: '45° FOV camera positioned at (0, 4, 5) looking at the origin; aspect kept in sync on resize.' },
          { name: 'renderer', type: 'THREE.WebGLRenderer', desc: 'Antialiased renderer with shadow maps enabled; its canvas is appended to document.body.' },
          { name: 'controls', type: 'OrbitControls', desc: 'Damped orbit controls targeting (0, 0.5, 0). Call controls.update() each frame.' },
          { name: 'ambientLight', type: 'THREE.AmbientLight', desc: 'The fill light. Adjust directly, or through syncLights().' },
          { name: 'dirLight', type: 'THREE.DirectionalLight', desc: 'The shadow-casting sun, 2048×2048 shadow map. Adjust directly, or through syncLights().' },
          { name: 'syncLights', type: '(config: DemoSceneConfig) => void', desc: 'Apply ambient intensity, sun intensity and sun position from a config object in one go.' },
        ]}
      />
      <PropTable
        label="DemoSceneConfig"
        cols={['Field', 'Type', '', 'Effect']}
        rows={[
          { name: 'ambientIntensity', type: 'number', desc: 'Sets ambientLight.intensity — overall flat fill.' },
          { name: 'sunIntensity', type: 'number', desc: 'Sets dirLight.intensity — strength of the directional sun and its shadows.' },
          { name: 'sunX', type: 'number', desc: 'Sun X position.' },
          { name: 'sunY', type: 'number', desc: 'Sun Y position.' },
          { name: 'sunZ', type: 'number', desc: 'Sun Z position.' },
        ]}
      />
      <Notes>
        <p>
          <code>createDemoScene()</code> takes no arguments — it is a deliberately opinionated starting point,
          not a configurable scene factory. Everything it returns is a plain Three.js object you can tweak or
          replace.
        </p>
        <p>
          It is <strong>client-only</strong>: it appends its <code>renderer.domElement</code> canvas to{' '}
          <code>document.body</code> and registers a <code>resize</code> listener, so call it from browser code
          (an effect or a <code>&apos;use client&apos;</code> module), never during server rendering.
        </p>
        <p>
          Pair it with <Link href="/demokit/demo-interaction/">createDemoInteraction</Link> for drag-to-turn,
          and feed your panel sliders into <code>syncLights</code>. The book it hosts is configured via{' '}
          <Link href="/book/book-options/">BookOptions</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
