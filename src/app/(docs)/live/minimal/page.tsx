import { BookOpen } from 'lucide-react'
import { ExportPage } from '@/components/ExportPage'
import { FullScreenPreview } from '@/components/Preview'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { findExport } from '@/components/exports'

const e = findExport('/live/minimal/')!

const CODE = `import * as THREE from 'three'
import { Book, BookContent, StapleBookBinding, createPageTexture } from '@objectifthunes/three-book'
import { createDemoScene, createDemoInteraction } from '@objectifthunes/three-book/demo-kit'

const { scene, camera, renderer, controls } = createDemoScene()
createDemoInteraction(camera, renderer.domElement, controls, true)

const content = new BookContent()
for (let i = 0; i < 4; i++) content.covers.push(createPageTexture('#7b3f00', '', null, 'contain', false, 2, 3))
for (let i = 0; i < 8; i++) content.pages.push(createPageTexture('#f5efe0', \`Page \${i + 1}\`, null, 'contain', false, 2, 3))

const book = new Book({ content, binding: new StapleBookBinding(), initialOpenProgress: 0.5 })
book.init()
scene.add(book)

const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  for (const b of Book.instances) b.update(clock.getDelta())
  renderer.render(scene, camera)
}
animate()`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <FullScreenPreview href="/full/minimal/" illustration={<BookOpen size={40} strokeWidth={1.25} />} />
      <Source code={CODE} lang="ts" />
      <Notes>
        <p>
          This is the whole thing: a scene from the demo kit, eight cream pages and four covers built with{' '}
          <code>createPageTexture</code>, a <code>StapleBookBinding</code>, and a render loop that calls{' '}
          <code>book.update(dt)</code>. Drag a page to turn it.
        </p>
        <p>
          The only non-obvious step is the loop — <code>Book</code> animates itself, so you must call{' '}
          <code>update(dt)</code> every frame (here for every live instance via the static{' '}
          <code>Book.instances</code>). See <a href="/book/lifecycle/">Lifecycle</a> for the details.
        </p>
      </Notes>
    </ExportPage>
  )
}
