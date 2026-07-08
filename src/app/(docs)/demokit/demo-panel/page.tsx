import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ExportPage } from '@/components/ExportPage'
import { Source } from '@/components/Source'
import { Notes } from '@/components/Notes'
import { PropTable } from '@/components/PropTable'
import { findExport } from '@/components/exports'

const e = findExport('/demokit/demo-panel/')!

const CODE = `import {
  createDemoPanel,
  addSectionTitle,
  addSlider,
  addColor,
} from '@objectifthunes/three-book/demo-kit'

// Build a tab's content as a plain HTMLElement, then fill it with controls.
const bookTab = document.createElement('div')
addSectionTitle(bookTab, 'Lighting')
addSlider(bookTab, 'Sun intensity', 0, 3, 0.1, 1.2, (v) => {
  ds.syncLights({ ...params, sunIntensity: v })
})
addSlider(bookTab, 'Ambient', 0, 2, 0.1, 0.6, (v) => {
  ds.syncLights({ ...params, ambientIntensity: v })
})
addColor(bookTab, 'Cover colour', '#8b1a1a', (hex) => {
  book.coverPaperSetup = { color: new THREE.Color(hex) }
})

const texturesTab = document.createElement('div')
// ...

const panel = createDemoPanel({
  title: 'three-book demo',
  subtitle: 'Drag to turn \\u00B7 right-click + wheel to orbit',
  tabs: [
    { key: 'book', label: 'Book', content: bookTab },
    { key: 'textures', label: 'Textures', content: texturesTab },
  ],
})

panel.setStatus('Ready')   // update the status strip
panel.switchTab('textures') // programmatically change tab`

export default async function Page() {
  return (
    <ExportPage group={e.group} title={e.name} lede={e.lede}>
      <PlaygroundCta />
      <Source code={CODE} lang="ts" />
      <PropTable
        label="createDemoPanel — config & return"
        cols={['Member', 'Type', '', 'Meaning']}
        rows={[
          { name: 'config.title', type: 'string', desc: 'Heading shown at the top of the panel.' },
          { name: 'config.subtitle', type: 'string', desc: 'Smaller line under the title — a hint or instructions.' },
          { name: 'config.tabs', type: 'DemoPanelTab[]', desc: 'Each tab is { key, label, content }, where content is the HTMLElement shown when the tab is active. The first tab starts active.' },
          { name: 'root', type: 'HTMLElement', desc: 'The panel element (already appended to document.body).' },
          { name: 'toggleBtn', type: 'HTMLElement', desc: 'The "☰ Panel" button shown when the panel is collapsed via its close button.' },
          { name: 'statusEl', type: 'HTMLElement', desc: 'The status strip element.' },
          { name: 'setStatus', type: '(msg: string) => void', desc: 'Replace the text in the status strip — e.g. "Building…", "Ready".' },
          { name: 'switchTab', type: '(key: string) => void', desc: 'Show the tab with the given key and highlight its button.' },
        ]}
      />
      <PropTable
        label="CONTROL BUILDERS"
        cols={['Function', 'Signature', '', 'What it appends']}
        rows={[
          { name: 'addSectionTitle', type: '(container, text)', desc: 'A section heading div. Returns the heading element.' },
          { name: 'addCollapseToggle', type: '(container, label, initiallyOpen)', desc: 'A clickable header plus a body div that toggles open/closed. Returns { header, body } — add controls to body. initiallyOpen sets the starting state.' },
          { name: 'addSlider', type: '(container, label, min, max, step, value, onChange)', desc: 'A labelled range input with a live value read-out. onChange(v: number) fires on input. Returns the <input>.' },
          { name: 'addColor', type: '(container, label, value, onChange)', desc: 'A labelled colour picker. onChange(v: string) gives the hex. Returns the <input>.' },
          { name: 'addCheckbox', type: '(container, label, value, onChange)', desc: 'A labelled checkbox. onChange(v: boolean) fires on change. Returns the <input>.' },
          { name: 'addSelect', type: '(container, label, value, options, onChange)', desc: 'A labelled dropdown; options is { value, label }[]. onChange(v: string) gives the selected value. Returns the <select>.' },
        ]}
      />
      <Notes>
        <p>
          <code>createDemoPanel</code> is the floating, draggable-free control surface you see in the live demo
          — the <em>Book / Textures / Editor</em> tabs all live inside one panel. It appends itself (and a
          collapsed toggle button) to <code>document.body</code> for you, so it is client-only.
        </p>
        <p>
          The control builders are intentionally framework-free: each one creates DOM, appends it to the{' '}
          <code>container</code> you pass, wires a single <code>onChange</code> callback, and returns the raw
          input so you can read or update it later. All styling comes from{' '}
          <code>@objectifthunes/three-book/demo.css</code>.
        </p>
        <p>
          A common pattern: build each tab&apos;s <code>HTMLElement</code>, fill it with{' '}
          <code>addSlider</code> / <code>addColor</code> / <code>addSelect</code> calls that mutate your state
          and re-sync the book, then hand the tabs to <code>createDemoPanel</code>. For page navigation and
          image uploads, combine it with <code>createPageNavigation</code> and{' '}
          <code>createImageSlotCard</code> from the same <Link href="/demokit/overview/">demo-kit</Link>.
        </p>
      </Notes>
    </ExportPage>
  )
}
