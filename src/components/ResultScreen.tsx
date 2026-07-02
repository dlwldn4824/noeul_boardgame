import type { Team } from '../types'

interface ResultScreenProps {
  teams: Team[]
  winnerName: string
  onRestart: () => void
}

export function ResultScreen({ teams, winnerName, onRestart }: ResultScreenProps) {
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score)

  return (
    <main className="start-screen">
      <section className="start-card result-card">
        <p className="eyebrow">게임 종료</p>
        <h1>{winnerName} 우승!</h1>
        <p className="start-description">2바퀴를 먼저 완주했습니다.</p>

        <div className="result-score-list">
          {rankedTeams.map((team, index) => (
            <article key={team.id} className="result-score-item" style={{ borderColor: team.color }}>
              <span className="result-rank">{index + 1}위</span>
              <strong>{team.name}</strong>
              <span>{team.laps}바퀴 · {team.score}점</span>
            </article>
          ))}
        </div>

        <button className="primary-button" onClick={onRestart}>
          처음으로
        </button>
      </section>
    </main>
  )
}
