import { useEffect, useState } from 'react'

const ROLL_DURATION_MS = 5000

export function useMemberRoulette(members: string[], targetMember: string, rollKey: number) {
  const [displayName, setDisplayName] = useState(targetMember)
  const [isRolling, setIsRolling] = useState(true)

  useEffect(() => {
    if (members.length === 0) {
      setDisplayName(targetMember || '팀원')
      setIsRolling(false)
      return
    }

    if (members.length === 1) {
      setDisplayName(members[0])
      setIsRolling(false)
      return
    }

    let timeoutId = 0
    let cancelled = false
    const startTime = Date.now()

    setIsRolling(true)
    setDisplayName(members[Math.floor(Math.random() * members.length)])

    const tick = () => {
      if (cancelled) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / ROLL_DURATION_MS, 1)

      if (progress >= 1) {
        setDisplayName(targetMember)
        setIsRolling(false)
        return
      }

      const pool = members.filter((member) => member !== targetMember)
      const candidates = pool.length > 0 ? pool : members
      setDisplayName(candidates[Math.floor(Math.random() * candidates.length)])

      const delay = 45 + progress * progress * 320
      timeoutId = window.setTimeout(tick, delay)
    }

    tick()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [members, targetMember, rollKey])

  return { displayName, isRolling }
}
