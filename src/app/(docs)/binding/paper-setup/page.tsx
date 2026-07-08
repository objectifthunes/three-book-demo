import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveGeometry } from '@/components/live/examples'

const e = findExport('/binding/paper-setup/')!

const CODE = `import * as THREE from 'three'
import { Book, PaperSetup } from '@objectifthunes/three-book'

// PaperSetup describes the physical geometry of one kind of sheet.
// Pages: thin and floppy.
const pages = new PaperSetup({
  width: 2,
  height: 3,
  thickness: 0.004,   // thin
  stiffness: 12,      // floppy
  quality: 3,         // mesh subdivisions, 1…5
  color: new THREE.Color(1, 1, 1),
  material: null,     // default paper material
})

// Covers: thicker and stiffer.
const covers = new PaperSetup({
  width: 2.1,
  height: 3.1,
  thickness: 0.02,    // thick
  stiffness: 30,      // stiff
  quality: 3,
})

// In practice you usually pass the PaperSetupInit shape (no class, no quality)
// straight to BookOptions — the book builds the PaperSetup for you:
const book = new Book({
  content,
  pagePaperSetup:  { width: 2,   height: 3,   thickness: 0.004, stiffness: 12, color: new THREE.Color(1, 1, 1), material: null },
  coverPaperSetup: { width: 2.1, height: 3.1, thickness: 0.02,  stiffness: 30, color: new THREE.Color(1, 1, 1), material: null },
})

// Derived, read-only on the built setup:
pages.size           // THREE.Vector2(width, height)
pages.uvMargin       // PaperUVMargin, oriented by bookDirection`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveGeometry />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="PaperSetup CONSTRUCTOR OPTIONS"
        cols={['Field', 'Type', 'Default', 'Meaning']}
        rows={[
          { name: 'width', type: 'number', def: '2', desc: 'Sheet width in world units (clamped to ≥ 1).' },
          { name: 'height', type: 'number', def: '2', desc: 'Sheet height in world units (clamped to ≥ 1).' },
          { name: 'thickness', type: 'number', def: '0.0002', desc: 'Sheet thickness. Pages are thin (~0.004), covers thicker (~0.02).' },
          { name: 'stiffness', type: 'number', def: '0.1', desc: 'Resistance to bending while turning. Floppy pages low, stiff covers high.' },
          { name: 'rigid', type: 'boolean', def: 'false', desc: 'A rigid board never bends — the turn is a pure hinge rotation. Made for hardcover boards; overrides stiffness.' },
          { name: 'quality', type: 'number', def: '3', desc: 'Mesh subdivision level, clamped 1…5. Higher = smoother bend, more geometry.' },
          { name: 'color', type: 'THREE.Color', def: 'white', desc: 'Base tint multiplied with the page texture; keep white to render textures true.' },
          { name: 'material', type: 'THREE.Material | null', def: 'null', desc: 'Override the paper material entirely, or null for the default.' },
        ]}
      />
      <PropTable
        label="PaperSetupInit — used by BookOptions"
        cols={['Field', 'Type', '', 'Meaning']}
        rows={[
          { name: 'width', type: 'number', desc: 'Sheet width in world units.' },
          { name: 'height', type: 'number', desc: 'Sheet height in world units.' },
          { name: 'thickness', type: 'number', desc: 'Sheet thickness.' },
          { name: 'stiffness', type: 'number', desc: 'Bending resistance during a turn.' },
          { name: 'color', type: 'THREE.Color', desc: 'Base tint for the sheet.' },
          { name: 'material', type: 'THREE.Material | null', desc: 'Material override, or null for the default.' },
        ]}
      />
      <PropTable
        label="DERIVED — read-only"
        cols={['Field', 'Type', '', 'Meaning']}
        rows={[
          { name: 'size', type: 'THREE.Vector2', desc: 'Computed from width × height (orientation-aware).' },
          { name: 'uvMargin', type: 'PaperUVMargin', desc: 'UV inset, transformed by bookDirection — you do not set this directly.' },
          { name: 'bookDirection', type: 'BookDirection', desc: 'Set internally by the book; swaps width/height for vertical reading directions.' },
        ]}
      />
      <Notes>
        <p>
          A <code>PaperSetup</code> is geometry only — it has no idea what is printed on the sheet
          (that is page <Link href="/content/book-content/">content</Link> and{' '}
          <Link href="/textures/page-textures/">textures</Link>). The two values you tune most are{' '}
          <code>thickness</code> and <code>stiffness</code>: pages are typically thin and floppy
          (<code>thickness ~0.004</code>, low <code>stiffness ~12</code>) while covers are thick and
          rigid (<code>thickness ~0.02</code>, high <code>stiffness ~30</code>). That contrast is what
          makes covers hold their shape while pages flop realistically through a turn.
        </p>
        <p>
          Most code never constructs <code>PaperSetup</code> directly: you hand the lighter{' '}
          <code>PaperSetupInit</code> shape to{' '}
          <Link href="/book/book-options/">BookOptions.pagePaperSetup / coverPaperSetup</Link> and the
          book builds the setup for you. Note <code>quality</code> is a constructor option of the{' '}
          <code>PaperSetup</code> class, not part of <code>PaperSetupInit</code>. The{' '}
          <code>size</code>, <code>uvMargin</code> and <code>bookDirection</code> members are derived —
          read them, do not assign them.
        </p>
      </Notes>
    </ExportPage>
  )
}
