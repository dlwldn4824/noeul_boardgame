interface DiceProps {
  value: number | null
  isRolling: boolean
  disabled: boolean
  onRoll: () => void
}

export function Dice({ value, isRolling, disabled, onRoll }: DiceProps) {
  return (
    <section className="dice-panel">
      <div className={`dice-face ${isRolling ? 'rolling' : ''}`}>{value ?? '?'}</div>
      <button className="primary-button dice-button" disabled={disabled} onClick={onRoll}>
        {isRolling ? '굴리는 중...' : '주사위 굴리기'}
      </button>
    </section>
  )
}
