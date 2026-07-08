import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveBinding } from '@/components/live/examples'

const e = findExport('/binding/staple-book-binding/')!

const CODE = `import { Book, StapleBookBinding } from '@objectifthunes/three-book'

// The saddle-stitched magazine spine: folded sheets, staples down the fold.
// The lightest binding — construct it and pass it, no setup required.
const book = new Book({
  content,
  binding: new StapleBookBinding(),
  // hideBinder: true,  // build the binding but hide the staple meshes
})`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveBinding />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="STAPLESETUP (binding.setup)"
        cols={['Prop', 'Type', 'Default', 'Role']}
        rows={[
          { name: 'count', type: 'number', def: '4', desc: 'How many staples run down the fold (clamped 2…10).' },
          { name: 'thickness', type: 'number', def: '0.05', desc: 'Wire thickness of each staple.' },
          { name: 'crown', type: 'number', def: '0.2', desc: 'Length of the exposed staple crown across the fold.' },
          { name: 'margin', type: 'number', def: '0.1', desc: 'Inset of the staple run from the head/tail edges (0…1).' },
          { name: 'color', type: 'THREE.Color', def: 'white', desc: 'Staple metal colour.' },
          { name: 'material', type: 'THREE.Material | null', def: 'null', desc: 'Override the staple material, or null for the default metal.' },
        ]}
      />
      <Notes>
        <p>
          <code>StapleBookBinding</code> is one of the two built-in spines — the magazine one.
          Folded sheets pivot on a single binding fold with staples down the middle. It needs no
          configuration: <code>new StapleBookBinding()</code> as the{' '}
          <Link href="/book/book-options/">BookOptions</Link> <code>binding</code> is all it takes.
        </p>
        <p>
          For the premium, rigid-boarded look see{' '}
          <Link href="/binding/glued-book-binding/">GluedBookBinding</Link> — use the{' '}
          <strong>spine toggle</strong> on the canvas above to compare the two, and{' '}
          <code>hideBinder</code> to drop the staple mesh.
        </p>
      </Notes>
    </ExportPage>
  )
}
