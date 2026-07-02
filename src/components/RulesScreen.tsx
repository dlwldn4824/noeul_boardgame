const GAME_RULES = [
  '한 바퀴를 완주하면 20점을 획득합니다.',
  '점수가 적힌 칸에 도착하면 해당 점수를 획득합니다.',
  '미션 칸은 걸린 팀이 아니라, 미션 게임에서 승리한 팀이 점수를 획득합니다.',
  '원샷 칸에 도착하면 해당 팀의 지정된 세션 전원이 원샷합니다.',
  '주당의 길 칸은 팀원과 나누어 마시는 것이 가능합니다.',
  '주사위를 던진 팀원이 해당 칸의 미션을 수행합니다.',
  '주사위는 팀원들이 돌아가며 한 번씩 던져 주세요.',
  '2바퀴를 먼저 완주한 팀이 생기면 게임이 종료됩니다.',
  '우승은 최종 점수가 가장 높은 팀입니다.',
]

interface RulesScreenProps {
  onNext: () => void
}

export function RulesScreen({ onNext }: RulesScreenProps) {
  return (
    <main className="start-screen">
      <section className="start-card rules-card">
        <p className="eyebrow">NOEUL 주루마블</p>
        <h1>게임 규칙</h1>

        <ul className="rules-list">
          {GAME_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>

        <button className="primary-button" onClick={onNext}>
          조 입력하기
        </button>
      </section>
    </main>
  )
}
