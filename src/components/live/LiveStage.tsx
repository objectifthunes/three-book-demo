'use client'

import { forwardRef, type ReactNode } from 'react'
import { Eye } from 'lucide-react'
import { Eyebrow } from '../Eyebrow'

/** A framed, in-page live canvas with an optional controls strip — themed to the docs. */
export const LiveStage = forwardRef<HTMLDivElement, {
  /** Example-specific controls, in a strip under the canvas. */
  controls?: ReactNode
  /** A floating overlay pinned to the top of the canvas (the spine switch). */
  overlay?: ReactNode
  hint?: string
  tall?: boolean
}>(function LiveStage({ controls, overlay, hint, tall }, ref) {
  return (
    <div className="export-block">
      <Eyebrow icon={<Eye size={12} strokeWidth={1.75} />}>LIVE</Eyebrow>
      <div className="live">
        <div className={`live__stage${tall ? ' live__stage--tall' : ''}`}>
          <div ref={ref} className="live__canvas" aria-label="Interactive 3D example" />
          {overlay ? <div className="live__overlay">{overlay}</div> : null}
        </div>
        {hint ? <p className="live__hint">{hint}</p> : null}
        {controls ? <div className="live__controls">{controls}</div> : null}
      </div>
    </div>
  )
})
