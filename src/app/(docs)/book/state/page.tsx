import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'
import { LiveBookState } from '@/components/live/examples'

const e = findExport('/book/state/')!

const CODE = `// Everything below is a read-only getter — poll it inside your render loop.
function animate(dt: number) {
  book.update(dt)

  if (!book.isBuilt) return                 // geometry not ready yet

  // Coarse activity flags
  if (book.isIdle) {
    // settled: no manual turn, no fall, no auto-turn in flight
  }
  if (book.isTurning)      { /* a page is being dragged or animated */ }
  if (book.isFalling)      { /* a released page is settling back     */ }
  if (book.isAutoTurning)  { /* a programmatic turn is playing       */ }
  if (book.hasPendingAutoTurns) { /* more queued auto-turns to come  */ }

  // Geometry / position
  console.log(book.openProgress)            // 0 (closed) … 1 (open at back)
  console.log(book.paperCount, book.coverPaperCount, book.pagePaperCount)

  // Per-paper state
  for (const paper of book.papers) {
    if (paper.isTurning) {
      console.log(paper.index, paper.isOnRightStack, paper.thickness)
    }
  }
}

// Static: every live book — handy for a single update / dispose sweep.
import { Book } from '@objectifthunes/three-book'
for (const b of Book.instances) b.update(dt)`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <LiveBookState />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="BOOK STATE (read-only)"
        cols={['Member', 'Type', '', 'Meaning']}
        rows={[
          { name: 'isBuilt', type: 'boolean', desc: 'True once init() has produced geometry. Guard every other read with this.' },
          { name: 'isTurning', type: 'boolean', desc: 'A page is currently being turned — dragged by the pointer or animated.' },
          { name: 'isFalling', type: 'boolean', desc: 'A released page is settling (falling) back into place.' },
          { name: 'isIdle', type: 'boolean', desc: 'Nothing is moving: no manual turn, no fall, no auto-turn in flight.' },
          { name: 'isAutoTurning', type: 'boolean', desc: 'A programmatic auto-turn is currently playing.' },
          { name: 'hasPendingAutoTurns', type: 'boolean', desc: 'One or more queued auto-turns remain to be played.' },
          { name: 'openProgress', type: 'number', desc: 'Live open state, 0 (closed) … 1 (open at the back), read from the actual paper positions.' },
          { name: 'paperCount', type: 'number', desc: 'Total sheet count (covers + pages).' },
          { name: 'coverPaperCount', type: 'number', desc: 'Number of cover sheets.' },
          { name: 'pagePaperCount', type: 'number', desc: 'Number of inner page sheets.' },
          { name: 'papers', type: 'Paper[]', desc: 'The live sheets, covers first. See the Paper table below.' },
          { name: 'Book.instances', type: 'static Book[]', desc: 'Every live book in the app. Iterate it to update or dispose all books in one sweep.' },
        ]}
      />
      <PropTable
        label="PAPER (notable members)"
        cols={['Member', 'Type', '', 'Meaning']}
        rows={[
          { name: 'index', type: 'number', desc: 'Position of this sheet in the stack (0 is the front cover).' },
          { name: 'isTurning', type: 'boolean', desc: 'This specific sheet is being turned right now.' },
          { name: 'isFalling', type: 'boolean', desc: 'This sheet is settling back after release.' },
          { name: 'isOnRightStack', type: 'boolean', desc: 'True when the sheet currently rests on the right-hand (unturned) stack.' },
          { name: 'thickness', type: 'number', desc: 'Sheet thickness in world units.' },
          { name: 'size', type: 'THREE.Vector2', desc: 'Width × height of the sheet in world units.' },
        ]}
      />
      <Notes>
        <p>
          This whole surface is <strong>read-only and pull-based</strong>: these are getters, not
          events. There is no <code>onTurnComplete</code> callback on <code>Book</code> — you poll
          the flags you care about inside the same loop that calls <code>update(dt)</code>. A common
          pattern is watching <code>isIdle</code> flip back to <code>true</code> to know a turn has
          fully settled.
        </p>
        <p>
          Always gate reads behind <code>isBuilt</code>, since <code>papers</code> is empty before{' '}
          <Link href="/book/lifecycle/">init()</Link> runs. For pointer-driven turn{' '}
          <em>callbacks</em> (start / end), use{' '}
          <Link href="/turning/interaction/">BookPointerInteraction</Link>; for programmatic turns
          see <Link href="/turning/auto-turn/">Auto-turning</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
