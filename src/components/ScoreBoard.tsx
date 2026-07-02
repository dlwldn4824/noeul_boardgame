import type { Team } from '../types'

interface ScoreBoardProps {
  teams: Team[]
  currentTeamId: number
}

export function ScoreBoard({ teams, currentTeamId }: ScoreBoardProps) {
  const rankedTeams = [...teams].sort((a, b) => b.score - a.score)

  return (
    <section className="score-board">
      <h2>점수판</h2>
      <div className="score-list">
        {rankedTeams.map((team, index) => (
          <article
            key={team.id}
            className={`score-item ${team.id === currentTeamId ? 'active' : ''}`}
            style={{ borderColor: team.color }}
          >
            <div className="score-rank">{index + 1}</div>
            <div>
              <strong>{team.name}</strong>
              <span>{team.laps}바퀴 · {team.position}번 칸</span>
            </div>
            <b>{team.score}점</b>
          </article>
        ))}
      </div>
    </section>
  )
}
