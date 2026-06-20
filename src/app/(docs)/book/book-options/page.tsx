import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveGeometry } from '@/components/live/examples'

const e = findExport('/book/book-options/')!

const CODE = `import * as THREE from 'three'
import { Book, StapleBookBinding } from '@objectifthunes/three-book'

const book = new Book({
  content,
  binding: new StapleBookBinding(),
  initialOpenProgress: 0.5,
  castShadows: true,
  alignToGround: false,
  pagePaperSetup:  { width: 2,   height: 3,   thickness: 0.02, stiffness: 0.2, color: new THREE.Color(1, 1, 1), material: null },
  coverPaperSetup: { width: 2.1, height: 3.1, thickness: 0.04, stiffness: 0.5, color: new THREE.Color(1, 1, 1), material: null },
})`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveGeometry />
      <Source code={CODE} lang="ts" />
      <PropTable
        rows={[
          { name: 'content', type: 'BookContent', def: 'empty', desc: 'The covers + pages to render. See BookContent.' },
          { name: 'binding', type: 'BookBinding', def: 'none', desc: 'How sheets attach at the spine. StapleBookBinding ships built-in.' },
          { name: 'initialOpenProgress', type: 'number', def: '0', desc: 'Where the book starts, 0 (closed) … 1 (open at the back).' },
          { name: 'buildOnAwake', type: 'boolean', def: 'true', desc: 'Build geometry as soon as the book is ready, rather than waiting.' },
          { name: 'castShadows', type: 'boolean', def: 'true', desc: 'Whether papers cast shadows. Turn off for a cheaper scene.' },
          { name: 'alignToGround', type: 'boolean', def: 'false', desc: 'Sit the closed book flat on y = 0 instead of centring it.' },
          { name: 'hideBinder', type: 'boolean', def: 'false', desc: 'Hide the spine binder mesh (e.g. the staples).' },
          { name: 'reduceShadows', type: 'boolean', def: 'false', desc: 'Cheaper shadow path — see Performance flags.' },
          { name: 'reduceSubMeshes', type: 'boolean', def: 'false', desc: 'Fewer sub-meshes per paper. Trades fidelity for draw calls.' },
          { name: 'reduceOverdraw', type: 'boolean', def: 'false', desc: 'Reduce overlapping fragments during a turn.' },
          { name: 'coverPaperSetup', type: 'Partial<PaperSetupInit>', def: '—', desc: 'Geometry of the covers: size, thickness, stiffness, colour, material.' },
          { name: 'pagePaperSetup', type: 'Partial<PaperSetupInit>', def: '—', desc: 'Geometry of the pages: size, thickness, stiffness, colour, material.' },
        ]}
      />
      <PropTable
        label="PAPERSETUPINIT"
        cols={['Field', 'Type', '', 'Meaning']}
        rows={[
          { name: 'width', type: 'number', desc: 'Sheet width in world units.' },
          { name: 'height', type: 'number', desc: 'Sheet height in world units.' },
          { name: 'thickness', type: 'number', desc: 'Sheet thickness — pages ~0.02, covers ~0.04.' },
          { name: 'stiffness', type: 'number', desc: 'Resistance to bending while turning, 0…1. Pages ~0.2, covers ~0.5.' },
          { name: 'color', type: 'THREE.Color', desc: 'Base tint multiplied with the page texture (use white to keep textures true).' },
          { name: 'material', type: 'THREE.Material | null', desc: 'Override the paper material entirely, or null for the default.' },
        ]}
      />
      <Notes>
        <p>
          Everything except <code>content</code> has a sensible default, so a book can be as terse as{' '}
          <code>new Book(&#123; content &#125;)</code>. The two <code>*PaperSetup</code> objects are the most
          common things to tweak — they set the physical feel of the covers versus the pages.
        </p>
        <p>
          The setups are also settable after construction (<code>book.pagePaperSetup = &#123;…&#125;</code>), as is{' '}
          <code>content</code>. The geometry-only fields live on{' '}
          <Link href="/binding/paper-setup/">PaperSetup</Link>; the rendering trade-off flags are detailed under{' '}
          <Link href="/reference/performance/">Performance flags</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
