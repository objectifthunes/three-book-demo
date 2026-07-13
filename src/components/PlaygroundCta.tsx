import Link from 'next/link'
import { Play } from 'lucide-react'

/**
 * Docs pages are snippet-first — the live canvases live in the two flagship
 * playgrounds. This strip points there.
 */
export function PlaygroundCta() {
  return (
    <p className="playground-cta">
      <Play size={12} strokeWidth={2} />
      <span>
        See it live in the{' '}
        <Link href="/play/staple/">Staple playground</Link> or the{' '}
        <Link href="/play/glued-spine/">Glued spine playground</Link> — every option on this page is a control there.
      </span>
    </p>
  )
}
