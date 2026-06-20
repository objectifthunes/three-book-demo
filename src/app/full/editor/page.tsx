'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let dispose: (() => void) | undefined
    let cancelled = false
    import('@/demo/three-book/main').then((m) => {
      if (cancelled) return
      dispose = m.mountThreeBookDemo()
      setLoaded(true)
    })
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])

  if (loaded) return null
  return <div className="loading-note">Loading the three-book studio…</div>
}
