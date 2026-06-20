import Link from 'next/link'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/reference/enums/')!

const CODE = `import {
  BookDirection,
  AutoTurnDirection,
  AutoTurnMode,
  AutoTurnSettingMode,
  AutoTurnSettingCurveTimeMode,
} from '@objectifthunes/three-book'

// Reading direction is set on BookContent:
content.direction = BookDirection.RightToLeft

// Auto-turning takes a direction + a mode:
book.startAutoTurning(AutoTurnDirection.Next, settings)

// Inside AutoTurnSettings, each setting can be Constant, random, or curve-driven:
settings.mode = AutoTurnMode.Edge`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <Source code={CODE} lang="ts" />

      <PropTable
        label="BookDirection"
        cols={['Member', 'Value', '', 'Meaning']}
        rows={[
          { name: 'LeftToRight', type: '0', desc: 'Pages turn from left to right (default Western book).' },
          { name: 'RightToLeft', type: '1', desc: 'Pages turn from right to left (e.g. manga, Arabic).' },
          { name: 'UpToDown', type: '2', desc: 'Pages turn from top to bottom (flip pad).' },
          { name: 'DownToUp', type: '3', desc: 'Pages turn from bottom to top.' },
        ]}
      />

      <PropTable
        label="AutoTurnDirection"
        cols={['Member', 'Value', '', 'Meaning']}
        rows={[
          { name: 'Next', type: '0', desc: 'Turn toward the next page (forward).' },
          { name: 'Back', type: '1', desc: 'Turn toward the previous page (backward).' },
        ]}
      />

      <PropTable
        label="AutoTurnMode"
        cols={['Member', 'Value', '', 'Meaning']}
        rows={[
          { name: 'Surface', type: '0', desc: 'Simulates swiping the paper surface to turn it.' },
          { name: 'Edge', type: '1', desc: 'Simulates holding the paper edge and turning it.' },
        ]}
      />

      <PropTable
        label="AutoTurnSettingMode"
        cols={['Member', 'Value', '', 'Meaning']}
        rows={[
          { name: 'Constant', type: '0', desc: 'A single fixed value for the setting.' },
          { name: 'RandomBetweenTwoConstants', type: '1', desc: 'A random value drawn between two constants.' },
          { name: 'Curve', type: '2', desc: 'A value sampled from a curve (see AutoTurnSettingCurveTimeMode).' },
          { name: 'RandomBetweenTwoCurves', type: '3', desc: 'A random value drawn between two curves.' },
        ]}
      />

      <PropTable
        label="AutoTurnSettingCurveTimeMode"
        cols={['Member', 'Value', '', 'Meaning']}
        rows={[
          { name: 'PaperIndexTime', type: '0', desc: 'Evaluates the curve at currentPaperIndex / totalPaperCount — proportional to progress through the papers.' },
          { name: 'TurnIndexTime', type: '1', desc: 'Evaluates the curve at currentTurnIndex / totalTurnCount — proportional to progress through the turns.' },
        ]}
      />

      <Notes>
        <p>
          All five are numeric TypeScript enums ported faithfully from the original C# plugin, so their values
          are stable and safe to persist or compare against literals.
        </p>
        <p>
          <code>BookDirection</code> is set on <Link href="/content/book-content/">BookContent</Link>. The four
          auto-turn enums all feed <Link href="/turning/auto-turn/">Auto-turning</Link> — they configure the
          direction, the turning feel, and how per-turn settings vary across the book.
        </p>
      </Notes>
    </ExportPage>
  )
}
