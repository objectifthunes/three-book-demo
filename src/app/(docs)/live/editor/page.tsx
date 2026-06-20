import { BookOpen } from 'lucide-react'
import { ExportPage } from '@/components/ExportPage'
import { FullScreenPreview } from '@/components/Preview'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { findExport } from '@/components/exports'

const e = findExport('/live/editor/')!

const CODE = `// The studio is the library's own demo, wired with the /demo-kit helpers.
import { Book } from '@objectifthunes/three-book'
import { createDemoScene, createDemoInteraction, createDemoPanel } from '@objectifthunes/three-book/demo-kit'

const { scene, camera, renderer, controls } = createDemoScene()
createDemoInteraction(camera, renderer.domElement, controls, true)

createDemoPanel({
  title: 'three-book demo',
  subtitle: 'Drag to turn · right-click + wheel to orbit',
  tabs: [
    { key: 'book', label: 'Book', content: bookTabEl },
    { key: 'textures', label: 'Textures', content: texturesTabEl },
    { key: 'editor', label: 'Editor', content: editorTabEl },
  ],
})`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <FullScreenPreview href="/full/editor/" illustration={<BookOpen size={40} strokeWidth={1.25} />} />
      <Source code={CODE} lang="ts" />
      <Notes>
        <p>
          The editor is the library&apos;s full Vite demo, ported verbatim and mounted into a route. Three tabs:
          <strong> Book</strong> tunes paper geometry (size, thickness, stiffness, page count, colours, lighting);
          <strong> Textures</strong> uploads cover and page images with <code>contain</code> / <code>cover</code> /{' '}
          <code>fill</code> fitting; <strong>Editor</strong> is a WYSIWYG canvas for placing and styling text blocks.
        </p>
        <p>
          Every control drives the real API documented across this site — <code>Book</code>, <code>BookContent</code>,{' '}
          <code>TextOverlayContent</code>, <code>SpreadContent</code> and the <code>/demo-kit</code> helpers. It runs
          entirely client-side and disposes the renderer when you leave the page.
        </p>
      </Notes>
    </ExportPage>
  )
}
