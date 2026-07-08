export type Badge = 'FULL-SCREEN' | 'CLASS' | 'UTIL' | 'TYPE'

export const LIB_NAME = '@objectifthunes/three-book'
export const LIB_VERSION = '0.5.8'
export const NPM_URL = 'https://www.npmjs.com/package/@objectifthunes/three-book'
export const REPO_URL = 'https://github.com/objectifthunes/three-book'

export interface ExportEntry {
  slug: string
  name: string
  group: GroupId
  href: string
  badge?: Badge
  lede: string
}

export type GroupId =
  | 'play'
  | 'start'
  | 'book'
  | 'turning'
  | 'content'
  | 'textures'
  | 'binding'
  | 'demokit'
  | 'reference'

export const GROUPS: { id: GroupId; label: string }[] = [
  { id: 'play',      label: 'Playgrounds'     },
  { id: 'start',     label: 'Getting started' },
  { id: 'book',      label: 'The Book'        },
  { id: 'turning',   label: 'Turning pages'   },
  { id: 'content',   label: 'Content & pages' },
  { id: 'textures',  label: 'Textures'        },
  { id: 'binding',   label: 'Binding'         },
  { id: 'demokit',   label: 'Demo kit'        },
  { id: 'reference', label: 'Reference'       },
]

export const EXPORTS: ExportEntry[] = [
  // Playgrounds — the two flagship canvases; every other page is snippet-first.
  { slug: 'staple', name: 'Staple playground', group: 'play', href: '/play/staple/', lede: 'The magazine binding with every option live: paper, staples, turning, and text you type straight onto the book.', badge: 'FULL-SCREEN' },
  { slug: 'hardcover', name: 'Hardcover playground', group: 'play', href: '/play/hardcover/', lede: 'The glued case binding with every option live: rigid boards, spine setup, turning, and WYSIWYG titles.', badge: 'FULL-SCREEN' },

  // Getting started
  { slug: 'quick-start', name: 'Quick start', group: 'start', href: '/start/quick-start/', lede: 'Mount a realistic 3D page-turning book into a Three.js scene in about twenty lines.' },
  { slug: 'concepts',    name: 'Core concepts', group: 'start', href: '/start/concepts/', lede: 'Papers, content, binding, the update loop — the mental model behind every other page.' },

  // The Book
  { slug: 'book-class', name: 'Book', group: 'book', href: '/book/book-class/', lede: 'The headline class. Construct it, add its root to your scene, and tick it every frame.', badge: 'CLASS' },
  { slug: 'book-options', name: 'BookOptions', group: 'book', href: '/book/book-options/', lede: 'Every constructor option: paper setups, shadows, binding, ground alignment, initial open state.', badge: 'TYPE' },
  { slug: 'lifecycle', name: 'Lifecycle', group: 'book', href: '/book/lifecycle/', lede: 'init(), update(dt), dispose() — when to call each, and why disposing is mandatory.' },
  { slug: 'state', name: 'Reading state', group: 'book', href: '/book/state/', lede: 'isBuilt, isTurning, openProgress, paperCount, papers[] and the rest of the read-only surface.' },

  // Turning pages
  { slug: 'interaction', name: 'Interactive turning', group: 'turning', href: '/turning/interaction/', lede: 'Drag pages with the pointer via BookPointerInteraction; toggle orbit controls while turning.', badge: 'CLASS' },
  { slug: 'auto-turn', name: 'Auto-turning', group: 'turning', href: '/turning/auto-turn/', lede: 'Animate page turns programmatically with direction, mode, timing curves and per-turn delays.' },
  { slug: 'open-progress', name: 'Open progress', group: 'turning', href: '/turning/open-progress/', lede: 'Jump to any spread instantly with setOpenProgress() and setOpenProgressByIndex().' },

  // Content & pages
  { slug: 'book-content', name: 'BookContent', group: 'content', href: '/content/book-content/', lede: 'The container for covers and pages, plus the four reading directions.', badge: 'CLASS' },
  { slug: 'page-content', name: 'Page content types', group: 'content', href: '/content/page-content/', lede: 'IPageContent, SpritePageContent2, and writing custom per-frame page content.' },
  { slug: 'text-overlay', name: 'Text overlays', group: 'content', href: '/content/text-overlay/', lede: 'Composite live, editable text on top of an image with TextOverlayContent.', badge: 'CLASS' },
  { slug: 'spreads', name: 'Spreads', group: 'content', href: '/content/spreads/', lede: 'A single image that spans both facing pages across the gutter, via SpreadContent.', badge: 'CLASS' },
  { slug: 'text-block', name: 'TextBlock', group: 'content', href: '/content/text-block/', lede: 'The styled text primitive: font, weight, alignment, shadow, rotation, clamping.', badge: 'CLASS' },

  // Textures
  { slug: 'page-textures', name: 'Page textures', group: 'textures', href: '/textures/page-textures/', lede: 'Turn a colour + text + image into a page texture with createPageTexture / createPageCanvas.', badge: 'UTIL' },
  { slug: 'images', name: 'Images & fit', group: 'textures', href: '/textures/images/', lede: 'loadImage, drawImageWithFit, computeDefaultImageRect and the contain / cover / fill modes.', badge: 'UTIL' },

  // Binding
  { slug: 'binding', name: 'BookBinding & BookBound', group: 'binding', href: '/binding/binding/', lede: 'The binding abstraction, and how to pick a spine — every book takes one via the binding option.', badge: 'CLASS' },
  { slug: 'staple-book-binding', name: 'StapleBookBinding', group: 'binding', href: '/binding/staple-book-binding/', lede: 'The saddle-stitched magazine spine: folded sheets down a stapled fold. The lightest binding, no setup required.', badge: 'CLASS' },
  { slug: 'glued-book-binding', name: 'GluedBookBinding', group: 'binding', href: '/binding/glued-book-binding/', lede: 'The case-bound hardcover spine: a glued page block wrapped in rigid boards and one smooth cover shell.', badge: 'CLASS' },
  { slug: 'paper-setup', name: 'PaperSetup', group: 'binding', href: '/binding/paper-setup/', lede: 'Per-book paper geometry: size, thickness, stiffness, quality and material.', badge: 'TYPE' },

  // Demo kit
  { slug: 'overview', name: 'demo-kit overview', group: 'demokit', href: '/demokit/overview/', lede: 'The batteries-included helpers that power this site’s live demo — import from /demo-kit.' },
  { slug: 'demo-scene', name: 'createDemoScene', group: 'demokit', href: '/demokit/demo-scene/', lede: 'A ready-made scene, camera, renderer, lights and OrbitControls with one call.', badge: 'UTIL' },
  { slug: 'demo-interaction', name: 'createDemoInteraction', group: 'demokit', href: '/demokit/demo-interaction/', lede: 'Wire pointer turning to the book and pause orbit controls mid-drag.', badge: 'UTIL' },
  { slug: 'demo-panel', name: 'createDemoPanel & controls', group: 'demokit', href: '/demokit/demo-panel/', lede: 'The tabbed control panel plus addSlider / addColor / addSelect / addCheckbox builders.', badge: 'UTIL' },

  // Reference
  { slug: 'enums', name: 'Enums', group: 'reference', href: '/reference/enums/', lede: 'BookDirection, AutoTurnDirection, AutoTurnMode and the auto-turn setting modes.', badge: 'TYPE' },
  { slug: 'types', name: 'Types index', group: 'reference', href: '/reference/types/', lede: 'A one-stop map of the option types and interfaces, with where each is used.', badge: 'TYPE' },
  { slug: 'performance', name: 'Performance flags', group: 'reference', href: '/reference/performance/', lede: 'reduceShadows, reduceSubMeshes, reduceOverdraw, castShadows — what each trades away.' },
]

export function groupOf(id: GroupId) {
  return GROUPS.find(g => g.id === id)!
}

export function exportsByGroup(id: GroupId) {
  return EXPORTS.filter(e => e.group === id)
}

export function findExport(href: string): ExportEntry | undefined {
  return EXPORTS.find(e => e.href === href)
}

export const TOTAL_EXPORTS = EXPORTS.length
