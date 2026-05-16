'use client'

import { useCallback, useEffect, useState } from 'react'

function key(openCallId: string) {
  return `ic-yec-favs-${openCallId}`
}

export function useFavourites(openCallId: string) {
  const [favs, setFavs] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key(openCallId))
      if (raw) setFavs(new Set(JSON.parse(raw) as string[]))
    } catch {}
  }, [openCallId])

  const toggle = useCallback((registrationId: string) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(registrationId)) next.delete(registrationId)
      else next.add(registrationId)
      try {
        localStorage.setItem(key(openCallId), JSON.stringify([...next]))
      } catch {}
      return next
    })
  }, [openCallId])

  const isFav = useCallback((registrationId: string) => favs.has(registrationId), [favs])

  return { favs, toggle, isFav }
}
