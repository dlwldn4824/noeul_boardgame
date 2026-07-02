import type { Team } from '../types'

interface ResultScreenProps {
  teams: Team[]
  onRestart: () => void
}

function getTopScorers(teams: Team[]) {
  if (teams.length === 0) return []

  const maxScore = Math.max(...teams.map((team) => team.score))
  return teams.filter((team) => team.score === maxScore)
}

export function ResultScreen({ teams, onRestart }: ResultScreenProps) {
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score)
  const winners = getTopScorers(teams)
  const winnerLabel = winners.map((team) => team.name).join(' · ')
  const isTie = winners.length > 1

  return (
    <main className="start-screen">
      <section className="start-card result-card">
        <p className="eyebrow">게임 종료</p>
        <h1>{winnerLabel} 우승!</h1>
        <p className="start-description">
          {isTie ? '최종 점수 동점 1위입니다.' : '최종 점수 1위입니다.'}
        </p>

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
