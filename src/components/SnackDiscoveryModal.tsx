import { useEffect, useState } from 'react'

interface SnackDiscoveryModalProps {
  onComplete: () => void | Promise<void>
}

const SNACK_EMOJIS = ['🍪', '🍫', '🍬', '🍭', '🥨', '🧁', '🍩', '🍿']
const SPARKLES = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${8 + (index * 17) % 84}%`,
  top: `${10 + (index * 23) % 70}%`,
  delay: `${(index % 6) * 0.15}s`,
  size: 14 + (index % 4) * 6,
}))

const FALLING_SNACKS = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  emoji: SNACK_EMOJIS[index % SNACK_EMOJIS.length],
  left: `${(index * 19) % 100}%`,
  delay: `${(index % 9) * 0.12}s`,
  duration: `${1.8 + (index % 4) * 0.35}s`,
}))

export function SnackDiscoveryModal({ onComplete }: SnackDiscoveryModalProps) {
  const [phase, setPhase] = useState<'search' | 'found'>('search')

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('found'), 2400)
    return () => window.clearTimeout(timer)
  }, [])

  if (phase === 'search') {
    return (
      <div className="snack-backdrop snack-search-phase" role="dialog" aria-modal="true">
        <div className="snack-dust-layer" aria-hidden="true">
          {SPARKLES.map((sparkle) => (
            <span
              key={sparkle.id}
              className="snack-sparkle"
              style={{
                left: sparkle.left,
                top: sparkle.top,
                animationDelay: sparkle.delay,
                fontSize: `${sparkle.size}px`,
              }}
            >
              ✨
            </span>
          ))}
        </div>
        <div className="snack-search-rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <section className="snack-modal snack-search-modal">
          <p className="snack-badge">???</p>
          <h2 className="snack-title wobble">어라~~?</h2>
          <p className="snack-message search-message">어라~~? 뭔가가 숨겨져있어!!</p>
          <div className="snack-search-icons" aria-hidden="true">
            <span>🔍</span>
            <span className="snack-question">?</span>
            <span>📦</span>
          </div>
          <button className="primary-button snack-button" onClick={() => setPhase('found')}>
            더 파볼까?!
          </button>
        </section>
      </div>
    )
  }

  return (
    <div className="snack-backdrop snack-found-phase" role="dialog" aria-modal="true">
      <div className="snack-confetti-layer" aria-hidden="true">
        {FALLING_SNACKS.map((snack) => (
          <span
            key={snack.id}
            className="snack-falling"
            style={{
              left: snack.left,
              animationDelay: snack.delay,
              animationDuration: snack.duration,
            }}
          >
            {snack.emoji}
          </span>
        ))}
      </div>
      <div className="snack-burst" aria-hidden="true" />
      <section className="snack-modal snack-found-modal">
        <p className="snack-badge found">발견!</p>
        <div className="snack-hero-emojis" aria-hidden="true">
          <span>🍪</span>
          <span className="snack-hero-main">🍫</span>
          <span>🍬</span>
        </div>
        <h2 className="snack-title found-title">우와!</h2>
        <p className="snack-message found-message">우와! 과자를 발견했어!!</p>
        <button className="primary-button snack-button found-button" onClick={onComplete}>
          과자 먹기!!
        </button>
      </section>
    </div>
  )
}
