import Link from 'next/link'
import { LIB_VERSION, TOTAL_EXPORTS } from './exports'

/** Sidebar brand block — small mark, "LIBRARY" eyebrow, name, version + export count. */
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="@objectifthunes/three-book home">
      <span className="brand__mark" aria-hidden>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 7C13 5 7.5 5 5 6.2V25c2.5-1.2 8-1.2 11 .8 3-2 8.5-2 11-.8V6.2C24.5 5 19 5 16 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 7v18.8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
      <span className="brand__text">
        <span className="brand__eyebrow">LIBRARY</span>
        <span className="brand__name">@objectifthunes/three-book</span>
        <span className="brand__meta">v{LIB_VERSION} · {TOTAL_EXPORTS} pages</span>
      </span>
    </Link>
  )
}
