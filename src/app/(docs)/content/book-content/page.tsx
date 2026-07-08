import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/content/book-content/')!

const CODE = `import * as THREE from 'three'
import { Book, BookContent, BookDirection, StapleBookBinding } from '@objectifthunes/three-book'

const content = new BookContent()

// Reading direction (default LeftToRight)
content.direction = BookDirection.LeftToRight

// Covers come FIRST. The demo uses four cover surfaces, in order:
//   front outer, front inner, back inner, back outer
content.covers.length = 0
content.covers.push(frontOuterTexture) // THREE.Texture
content.covers.push(frontInnerTexture)
content.covers.push(backInnerTexture)
content.covers.push(backOuterTexture)

// Then the interior pages — each entry is a THREE.Texture, an IPageContent,
// or null for a blank side.
content.pages.length = 0
for (let i = 0; i < pageTextures.length; i++) {
  content.pages.push(pageTextures[i]) // THREE.Texture | IPageContent | null
}

const book = new Book({
  content,
  binding: new StapleBookBinding(),
})
book.init()
scene.add(book)

// Swap content later by assigning a fresh BookContent — the book rebuilds:
// book.content = buildBookContent()`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="MEMBERS"
        rows={[
          { name: 'covers', type: '(THREE.Texture | IPageContent | null)[]', desc: 'The cover surfaces, pushed first. The demo uses four: front outer, front inner, back inner, back outer. Counts are rounded up to a multiple of four internally.' },
          { name: 'pages', type: '(THREE.Texture | IPageContent | null)[]', desc: 'The interior page sides, in reading order. A bare THREE.Texture is auto-wrapped in a SpritePageContent2; an IPageContent is used as-is; null renders a blank side.' },
          { name: 'direction', type: 'BookDirection', def: 'LeftToRight', desc: 'Which way the book reads / turns. See the enum below.' },
          { name: 'isEmpty', type: 'boolean', desc: 'True when both covers and pages are empty.' },
          { name: 'book', type: 'Book | null', desc: 'Read-only back-reference to the owning Book, set during init().' },
          { name: 'init', type: '(book: Book) => void', desc: 'Called by Book.init() — wires content to the book and initialises every page. You rarely call this yourself.' },
        ]}
      />
      <PropTable
        label="BOOKDIRECTION"
        cols={['Value', 'Number', '', 'Meaning']}
        rows={[
          { name: 'LeftToRight', type: '0', desc: 'Western default — spine on the left, pages turn right-to-left.' },
          { name: 'RightToLeft', type: '1', desc: 'Spine on the right (e.g. manga-style).' },
          { name: 'UpToDown', type: '2', desc: 'Top-bound flip book — pages turn downward.' },
          { name: 'DownToUp', type: '3', desc: 'Bottom-bound flip book — pages turn upward.' },
        ]}
      />
      <Notes>
        <p>
          <code>BookContent</code> is just the data container — covers and pages — that you hand to a{' '}
          <Link href="/book/book-class/">Book</Link> via <code>BookOptions.content</code>. Build it before{' '}
          <code>book.init()</code>, or assign a fresh instance to <code>book.content</code> later to rebuild
          pages in place. Each slot accepts a raw <code>THREE.Texture</code> (wrapped automatically) or any{' '}
          <Link href="/content/page-content/">IPageContent</Link>.
        </p>
        <p>
          Reach for an <code>IPageContent</code> when a page needs to change every frame or hit-test UI — for
          example a <Link href="/content/text-overlay/">TextOverlayContent</Link> compositing live text, or the
          two halves of a <Link href="/content/spreads/">SpreadContent</Link> pushed into consecutive{' '}
          <code>pages</code> slots.
        </p>
      </Notes>
    </ExportPage>
  )
}
