import Link from 'next/link'
import { PlaygroundCta } from '@/components/PlaygroundCta'
import { ArrowDownToLine, BookOpen, Code2, PlayCircle } from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { Eyebrow } from '@/components/Eyebrow'
import { GROUPS, exportsByGroup, LIB_VERSION, NPM_URL } from '@/components/exports'

const INSTALL = `pnpm add @objectifthunes/three-book three`

const WIRE_UP = `import * as THREE from 'three'
import { Book, BookContent, StapleBookBinding, createPageTexture } from '@objectifthunes/three-book'

const content = new BookContent()
for (let i = 0; i < 8; i++) {
  content.pages.push(createPageTexture('#f5efe0', \`Page \${i + 1}\`, null, 'contain', false, 2, 3))
}

const book = new Book({ content, binding: new StapleBookBinding(), initialOpenProgress: 0.5 })
book.init()
scene.add(book)

// in your render loop:
for (const b of Book.instances) b.update(clock.getDelta())`

const CATEGORY_BLURB: Record<string, string> = {
  start:     'Install, the twenty-line quick start, and the mental model: papers, content, binding, the loop.',
  book:      'The Book class itself — construction options, the init / update / dispose lifecycle, and reading state.',
  turning:   'Three ways pages move: pointer dragging, programmatic auto-turns with curves, and instant jumps.',
  content:   'BookContent, the page content interfaces, live text overlays, double-page spreads, and TextBlock.',
  textures:  'Build page textures from colour + text + image, with contain / cover / fill fitting and image rects.',
  binding:   'The staple binding you get for free, the BookBinding abstraction, and per-book PaperSetup.',
  demokit:   'The /demo-kit helpers that power this very site: scene, interaction, panel and form controls.',
  reference: 'Enums, the option-type index, and the performance flags with their trade-offs spelled out.',
  live:      'The full WYSIWYG studio and a bare minimal book — both running right here in the browser.',
}

export default async function HomePage() {
  return (
    <div className="landing">
      <section className="landing__hero">
        <Eyebrow icon={<BookOpen size={12} strokeWidth={1.75} />}>@OBJECTIFTHUNES/THREE-BOOK · DEMO</Eyebrow>
        <h1 className="landing__title">A real book. In your scene.</h1>
        <p className="landing__lede">
          A live, source-paired reference for <code>@objectifthunes/three-book</code> — a realistic 3D
          page-turning book for Three.js, with physical page curl, shadows, textured covers, spreads and
          editable text. Every export documented, with working examples you can run in the browser.
        </p>
        <div className="landing__hero-actions">
          <Link className="landing__cta landing__cta--primary" href="/play/glued-spine/">Open the glued spine playground ↗</Link>
          <Link className="landing__cta" href="/start/quick-start/">Quick start</Link>
          <a className="landing__cta" href={NPM_URL} target="_blank" rel="noopener noreferrer">npm</a>
        </div>
      </section>

      <section className="landing__block">
        <PlaygroundCta />
      </section>

      <section>
        <div className="landing__grid">
          {GROUPS.map(g => {
            const items = exportsByGroup(g.id)
            if (items.length === 0) return null
            const first = items[0]
            return (
              <Link key={g.id} href={first.href} className="landing__card">
                <div className="landing__card-row">
                  <span className="landing__card-title">{g.label}</span>
                  <span className="landing__card-count">{items.length} {items.length === 1 ? 'page' : 'pages'}</span>
                </div>
                <p className="landing__card-blurb">{CATEGORY_BLURB[g.id]}</p>
                <span className="landing__card-open">Open →</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="landing__block">
        <Eyebrow icon={<ArrowDownToLine size={12} strokeWidth={1.75} />}>INSTALL</Eyebrow>
        <CodeBlock code={INSTALL} lang="bash" />
        <Eyebrow icon={<Code2 size={12} strokeWidth={1.75} />}>WIRE-UP</Eyebrow>
        <CodeBlock code={WIRE_UP} lang="ts" />
      </section>

      <section className="landing__skill">
        <div className="landing__skill-header">
          <div>
            <Eyebrow icon={<PlayCircle size={12} strokeWidth={1.75} />}>SEE IT MOVE</Eyebrow>
            <h2 className="landing__skill-title">Live, all the way down.</h2>
          </div>
          <Link className="landing__skill-cta" href="/play/glued-spine/">Open glued spine playground</Link>
        </div>
        <p style={{ color: 'var(--ot-text-secondary)', fontSize: 14 }}>
          Every page on this site embeds the feature it documents as a real, interactive 3D example — drag a page
          on the <strong>Book</strong> page, hit auto-turn buttons under <strong>Turning</strong>, scrub the open
          slider, tune geometry in the <strong>Playground</strong>. Each runs inline on its own contained
          <code> WebGLRenderer</code>, composed from the published package — no separate app, no full-screen detour.
        </p>
        <ul className="landing__skill-bullets">
          <li>Drag pages to turn — physical curl + fall settling</li>
          <li>Right-click / scroll to orbit the camera</li>
          <li>Textured covers, pages, and double-page spreads</li>
          <li>Live editable text overlays with shadows</li>
          <li>v{LIB_VERSION} · framework-agnostic Three.js</li>
          <li>Everything here is on the published package</li>
        </ul>
      </section>
    </div>
  )
}
