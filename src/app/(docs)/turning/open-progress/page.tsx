import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/turning/open-progress/')!

const CODE = `// Jump straight to any open state — no animation, no settling.
book.setOpenProgress(0)      // fully closed
book.setOpenProgress(0.5)    // half open
book.setOpenProgress(1)      // fully open at the back

// Read the current value back (always derived from real paper positions):
console.log(book.openProgress)   // 0 … 1

// A slider driving the open state directly:
slider.addEventListener('input', () => {
  if (book.isBuilt) book.setOpenProgress(Number(slider.value)) // value in 0…1
})

// Buttons that snap to fixed spreads:
closedButton.onclick = () => book.setOpenProgress(0)
openButton.onclick   = () => book.setOpenProgress(1)`

const BYINDEX = `// Jump to a specific paper side instead of a 0…1 fraction.
// The index counts paper sides (front, back, front, back, …) from the start.
book.setOpenProgressByIndex(4)   // open at the 4th paper side`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />
      <PropTable
        label="METHODS"
        cols={['Method', 'Signature', '', 'What it does']}
        rows={[
          { name: 'setOpenProgress', type: '(t: number) => void', desc: 'Instantly moves every paper to match an open state in 0 (closed) … 1 (open at the back). No animation. Cancels any pending auto-turns.' },
          { name: 'setOpenProgressByIndex', type: '(paperSideIndex: number) => void', desc: 'Instantly opens the book at a specific paper side, counted from the start of the stack. Also a hard jump, no animation.' },
        ]}
      />
      <PropTable
        label="READING IT BACK"
        cols={['Member', 'Type', '', 'Meaning']}
        rows={[
          { name: 'openProgress', type: 'number (get)', desc: 'The live open state, 0 … 1, computed from the actual paper positions — so it reflects drags and auto-turns too, not just setOpenProgress calls.' },
        ]}
      />
      <Source code={BYINDEX} lang="ts" />
      <Notes>
        <p>
          <code>setOpenProgress(t)</code> and <code>setOpenProgressByIndex(i)</code> are{' '}
          <strong>instant jumps</strong>: they snap every paper to the requested spread in a single
          call, with no in-between animation and no settling. Both cancel any queued auto-turns
          first, so the book lands exactly where you asked. Use <code>setOpenProgress</code> for a
          continuous 0…1 control (a slider, a scroll position) and{' '}
          <code>setOpenProgressByIndex</code> when you think in concrete page/cover sides.
        </p>
        <p>
          Reading <code>book.openProgress</code> always reflects reality, since it is derived from
          where the papers actually are — useful for keeping a slider in sync while pages are dragged
          or auto-turned. When you want the turn to be <em>seen</em> rather than instant, reach for{' '}
          <Link href="/turning/auto-turn/">Auto-turning</Link> instead; for hand-dragging, see{' '}
          <Link href="/turning/interaction/">Interactive turning</Link>, and for the full read-only
          surface, <Link href="/book/state/">Reading state</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
