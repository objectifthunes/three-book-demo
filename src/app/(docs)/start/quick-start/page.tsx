import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { findExport } from '@/components/exports'

const e = findExport('/start/quick-start/')!

const INSTALL = `pnpm add @objectifthunes/three-book three`

const CODE = `import * as THREE from 'three'
import { Book, BookContent, StapleBookBinding, createPageTexture } from '@objectifthunes/three-book'

// 1 — a scene, camera and renderer (your own, or createDemoScene() from /demo-kit)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 4, 5)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)
scene.add(new THREE.AmbientLight(0xffffff, 0.8))
const sun = new THREE.DirectionalLight(0xffffff, 1.2)
sun.position.set(5, 10, 5)
scene.add(sun)

// 2 — content: four covers + a stack of pages, each a texture
const content = new BookContent()
for (let i = 0; i < 4; i++) content.covers.push(createPageTexture('#7b3f00', '', null, 'contain', false, 2, 3))
for (let i = 0; i < 8; i++) content.pages.push(createPageTexture('#f5efe0', \`Page \${i + 1}\`, null, 'contain', false, 2, 3))

// 3 — the book itself
const book = new Book({ content, binding: new StapleBookBinding(), initialOpenProgress: 0.5 })
book.init()
scene.add(book)

// 4 — tick it every frame
const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  for (const b of Book.instances) b.update(clock.getDelta())
  renderer.render(scene, camera)
}
animate()`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={INSTALL} lang="bash" />
      <Source code={CODE} lang="ts" />
      <Notes>
        <p>
          That is the whole loop: build <code>BookContent</code>, hand it to <code>Book</code> with a binding,
          call <code>init()</code>, add the book to your scene, and call <code>update(dt)</code> every frame.
          The book is a <code>THREE.Object3D</code>, so <code>scene.add(book)</code> just works.
        </p>
        <p>
          To turn pages by dragging, add <Link href="/turning/interaction/">BookPointerInteraction</Link>. To skip
          the boilerplate in step 1 entirely, use <Link href="/demokit/demo-scene/">createDemoScene()</Link> from
          the <code>/demo-kit</code> entry — that is exactly what the <Link href="/play/glued-spine/">glued spine playground</Link>{' '}
          do. When you tear the book down, always call <Link href="/book/lifecycle/"><code>book.dispose()</code></Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
