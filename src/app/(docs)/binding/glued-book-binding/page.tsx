import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/binding/glued-book-binding/')!

const CODE = `import { Book, GluedBookBinding } from '@objectifthunes/three-book'
import * as THREE from 'three'

const binding = new GluedBookBinding()
binding.setup.hingeGap = 0.03        // cloth-joint groove at each board
binding.setup.glueFlexWidth = 0.12   // page gutter flex zone
binding.setup.spineColor = new THREE.Color('#7a1f1f')
binding.setup.spineTexture = spineCanvasTexture // title art down the spine

const book = new Book({
  content, // covers[0..3] map to front / inner front / inner back / back
  binding,
  // One modular cover: lower stiffness is softer; rigid is an optional override.
  coverPaperSetup: { width: 2.15, height: 3.15, thickness: 0.06, stiffness: 0.75, rigid: false },
  pagePaperSetup: { width: 2, height: 3, thickness: 0.03, stiffness: 0.2 },
})`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="GLUEDSETUP (binding.setup)"
        cols={['Prop', 'Type', 'Default', 'Role']}
        rows={[
          { name: 'hingeGap', type: 'number', def: '0.03', desc: 'Cloth-joint groove between each board and the spine, in world units.' },
          { name: 'glueFlexWidth', type: 'number', def: '0.12', desc: 'Width of the page gutter flex zone — glued pages curve out of the spine instead of opening flat.' },
          { name: 'spineColor', type: 'THREE.Color', def: '#8c2626', desc: 'Cloth colour for the spine, hinges, edges and caps when no texture/material is set.' },
          { name: 'spineTexture', type: 'THREE.Texture | null', def: 'null', desc: 'Artwork/text for the spine zone (u across the spine width, v along the book height). Render a title into a canvas texture, rotated the classic way.' },
          { name: 'spineMaterial', type: 'THREE.Material | null', def: 'null', desc: 'Custom cloth material (fabric, leather…) for the non-printed zones. Overrides spineColor.' },
          { name: 'quality', type: 'number', def: '3', desc: 'Spine curve subdivision, clamped 0…5.' },
        ]}
      />
      <Notes>
        <p>
          The front cover, spine and back cover are <strong>one mesh</strong>: a
          constant-thickness shell bent around the block, with a single smooth spine curve that
          follows the covers at every opening angle. Pages are glued to the actual spine surface,
          so the block and cover read as one object closed or open.
        </p>
        <p>
          Five zones of that one mesh take real content: the four cover surfaces map{' '}
          <code>covers[0..3]</code> (front, inner front, inner back, back) exactly as they do on
          other bindings, and the spine takes <code>setup.spineTexture</code>. Hinges, fore edges
          and caps use the cloth colour or material.
        </p>
        <p>
          Cover softness is modular, not a second book type. Set <code>stiffness</code> on the{' '}
          <Link href="/binding/paper-setup/">cover paper setup</Link> exactly as you do for a
          staple-bound cover; the one-piece glued cover follows that deformation. Set{' '}
          <code>rigid: true</code> only when you want a fully rigid cover. Pick the glued or staple
          spine per book via the <code>binding</code> option.
        </p>
      </Notes>
    </ExportPage>
  )
}
