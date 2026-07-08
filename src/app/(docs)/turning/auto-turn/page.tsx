import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/turning/auto-turn/')!

const CODE = `import {
  AutoTurnDirection,
  AutoTurnMode,
  AutoTurnSettings,
  AutoTurnSetting,
} from '@objectifthunes/three-book'

// Build the animation profile for each turn.
const settings = new AutoTurnSettings()
settings.mode     = AutoTurnMode.Surface          // Surface | Edge
settings.duration = new AutoTurnSetting(0.6)      // 0.6 s per turn (constant)
settings.bend     = new AutoTurnSetting(1)        // how much the sheet bows
settings.twist    = new AutoTurnSetting(0)        // diagonal twist on the corner

// A bit of organic variation: random bend between two constants.
settings.bend = new AutoTurnSetting(0.8, 1.2)

// Turn 5 pages forward, 0.25 s apart.
const queued = book.startAutoTurning(
  AutoTurnDirection.Next,   // direction
  settings,                 // per-turn animation
  5,                        // turnCount
  0.25,                     // delayPerTurn (seconds; or an AutoTurnSetting)
)
// queued === true if at least one turn was scheduled.

// Bail out of anything still queued (the in-flight turn finishes):
book.cancelPendingAutoTurns()`

const CURVE = `import {
  AnimationCurve,
  AutoTurnSetting,
  AutoTurnSettingCurveTimeMode,
} from '@objectifthunes/three-book'

// Curve-based timing: drive a value from keyframes instead of a constant.
const curve = new AnimationCurve([
  { time: 0, value: 0.4 },   // Keyframe = { time, value }, linearly interpolated
  { time: 1, value: 0.9 },
])

// Evaluate the curve by progression through the turns (vs PaperIndexTime).
const duration = AutoTurnSetting.fromCurve(
  curve,
  AutoTurnSettingCurveTimeMode.TurnIndexTime,
)
settings.duration = duration`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="startAutoTurning(direction, settings, turnCount?, delayPerTurn?)"
        cols={['Param', 'Type', 'Default', 'Meaning']}
        rows={[
          { name: 'direction', type: 'AutoTurnDirection', desc: 'Next (forward) or Back (backward).' },
          { name: 'settings', type: 'AutoTurnSettings', desc: 'The per-turn animation: mode plus twist / bend / duration.' },
          { name: 'turnCount', type: 'number', def: '1', desc: 'How many pages to turn. Clamped to the number actually available in that direction.' },
          { name: 'delayPerTurn', type: 'number | AutoTurnSetting', def: '0', desc: 'Pause between consecutive turns, in seconds — a constant number or an AutoTurnSetting for varying delays.' },
          { name: '→ returns', type: 'boolean', desc: 'true if at least one turn was queued.' },
        ]}
      />
      <PropTable
        label="AutoTurnSettings"
        cols={['Member', 'Type', 'Default', 'Meaning']}
        rows={[
          { name: 'mode', type: 'AutoTurnMode', def: 'Surface', desc: 'How the sheet flips: Surface (rolls over a surface) or Edge.' },
          { name: 'twist', type: 'AutoTurnSetting', def: '0', desc: 'Diagonal twist applied to the turning corner.' },
          { name: 'bend', type: 'AutoTurnSetting', def: '1', desc: 'How much the sheet bows during the turn.' },
          { name: 'duration', type: 'AutoTurnSetting', def: '0.5', desc: 'Seconds per turn.' },
        ]}
      />
      <PropTable
        label="ENUMS"
        cols={['Enum', 'Members', '', 'Meaning']}
        rows={[
          { name: 'AutoTurnDirection', type: 'Next, Back', desc: 'Turn toward the back of the book, or back toward the front.' },
          { name: 'AutoTurnMode', type: 'Surface, Edge', desc: 'The flip style for the animated sheet.' },
          { name: 'AutoTurnSettingMode', type: 'Constant, RandomBetweenTwoConstants, Curve, RandomBetweenTwoCurves', desc: 'How an individual AutoTurnSetting resolves its value. Set implicitly by the constructor / factories.' },
          { name: 'AutoTurnSettingCurveTimeMode', type: 'PaperIndexTime, TurnIndexTime', desc: 'For curve modes: evaluate the curve by progress through papers, or progress through the queued turns.' },
        ]}
      />
      <PropTable
        label="AutoTurnSetting — constructing a value"
        cols={['Form', 'Signature', '', 'Resolves to']}
        rows={[
          { name: 'new AutoTurnSetting()', type: '()', desc: 'A constant zero.' },
          { name: 'new AutoTurnSetting(c)', type: '(constant: number)', desc: 'A fixed constant value.' },
          { name: 'new AutoTurnSetting(min, max)', type: '(constantMin, constantMax)', desc: 'A random value between two constants, re-rolled per turn.' },
          { name: 'AutoTurnSetting.fromCurve', type: '(curve, curveTimeMode)', desc: 'A value sampled from an AnimationCurve.' },
          { name: 'AutoTurnSetting.fromCurveRange', type: '(curveMin, curveMax, curveTimeMode)', desc: 'A random value between two curves.' },
        ]}
      />
      <Notes>
        <p>
          <code>startAutoTurning</code> queues one or more animated turns and returns immediately;
          the simulation plays them out over subsequent <code>update(dt)</code> calls. The book
          tracks progress through <Link href="/book/state/">isAutoTurning and hasPendingAutoTurns</Link>,
          and <code>cancelPendingAutoTurns()</code> clears anything still waiting (the turn already
          in flight is allowed to finish).
        </p>
        <p>
          Every numeric knob — <code>twist</code>, <code>bend</code>, <code>duration</code> and the{' '}
          <code>delayPerTurn</code> — is an <code>AutoTurnSetting</code>, so it can be a constant, a
          random range, or curve-driven. For curves, supply an <code>AnimationCurve</code> built from{' '}
          <code>{'{ time, value }'}</code> <code>Keyframe</code>s (linearly interpolated) and pick a{' '}
          <code>AutoTurnSettingCurveTimeMode</code>:
        </p>
        <Source code={CURVE} lang="ts" />
        <p>
          Auto-turning is the <em>animated</em> path. To jump straight to a spread with no animation,
          use <Link href="/turning/open-progress/">setOpenProgress</Link>; to let the user drag pages
          by hand, see <Link href="/turning/interaction/">Interactive turning</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
