import { useEffect, useState } from 'react'
import { useMemberRoulette } from '../hooks/useMemberRoulette'

interface SpectacularGoldKeyModalProps {
  teamName: string
  members: string[]
  pickedMember: string
  onComplete: () => void | Promise<void>
}

const CONFETTI = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 17) % 100}%`,
  delay: `${(index % 8) * 0.08}s`,
  color: ['#ffd43b', '#ff6b6b', '#51cf66', '#4dabf7', '#ff922b'][index % 5],
}))

function ChairmanMealReveal({
  teamName,
  members,
  pickedMember,
  onComplete,
}: SpectacularGoldKeyModalProps) {
  const { displayName, isRolling } = useMemberRoulette(members, pickedMember, 1)

  return (
    <div className="spectacular-backdrop reveal-phase" role="dialog" aria-modal="true">
      <div className="confetti-layer" aria-hidden="true">
        {CONFETTI.map((piece) => (
          <span
            key={piece.id}
            className="confetti-piece"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              background: piece.color,
            }}
          />
        ))}
      </div>
      <div className="golden-burst" aria-hidden="true" />
      <section className="spectacular-modal reveal-modal">
        <p className="jackpot-badge">★ 잭팟 ★</p>
        <h2 className="jackpot-title">대박!! 황금열쇠!!</h2>
        <p className="jackpot-team">{teamName}에서 당첨!</p>
        <p className={isRolling ? 'jackpot-member rolling' : 'jackpot-member revealed'}>
          {displayName}
        </p>
        <div className="jackpot-main">🍚 회장이 사주는 밥 먹기!! 🍚</div>
        <p className="jackpot-sub">
          {isRolling
            ? '누가 밥 먹을까요...?'
            : `${displayName}님, 오늘 밥은 회장님이 쏩니다!!`}
        </p>
        <button
          className="primary-button jackpot-button"
          disabled={isRolling}
          onClick={onComplete}
        >
          감사합니다 회장님!!
        </button>
      </section>
    </div>
  )
}

export function SpectacularGoldKeyModal({
  teamName,
  members,
  pickedMember,
  onComplete,
}: SpectacularGoldKeyModalProps) {
  const [phase, setPhase] = useState<'drumroll' | 'reveal'>('drumroll')

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('reveal'), 2400)
    return () => window.clearTimeout(timer)
  }, [])

  if (phase === 'drumroll') {
    return (
      <div className="spectacular-backdrop drumroll-phase" role="dialog" aria-modal="true">
        <div className="drumroll-rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <section className="spectacular-modal drumroll-modal">
          <p className="drumroll-label">황금열쇠 결과 발표 중...</p>
          <div className="drumroll-beats">
            <span>두구</span>
            <span>두구</span>
            <span>두구</span>
            <span>두구</span>
          </div>
          <p className="drumroll-sub">두구두구두구두구...</p>
        </section>
      </div>
    )
  }

  return (
    <ChairmanMealReveal
      teamName={teamName}
      members={members}
      pickedMember={pickedMember}
      onComplete={onComplete}
    />
  )
}
