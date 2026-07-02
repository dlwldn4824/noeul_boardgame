import { BOARD_CELLS } from '../data/board'
import type { Team } from '../types'

interface BoardProps {
  teams: Team[]
  showGuides: boolean
}

export function Board({ teams, showGuides }: BoardProps) {
  return (
    <section className="board-wrap" aria-label="NOEUL 주루마블 보드판">
      <img className="board-image" src="/noeul-board.png" alt="NOEUL 주루마블 보드판" />

      {showGuides &&
        BOARD_CELLS.map((cell) => (
          <div
            key={cell.id}
            className={`cell-guide ${cell.type}`}
            style={{ left: `${cell.x}%`, top: `${cell.y}%` }}
            title={`${cell.id}. ${cell.name}`}
          >
            {cell.id}
          </div>
        ))}

      {BOARD_CELLS.map((cell) => {
        const teamsOnCell = teams.filter((team) => team.position === cell.id)

        return (
          <div
            key={`tokens-${cell.id}`}
            className="token-stack"
            style={{ left: `${cell.x}%`, top: `${cell.y}%` }}
          >
            {teamsOnCell.map((team, index) => (
              <div
                key={team.id}
                className="team-token"
                style={{
                  background: team.color,
                  transform: `translate(${index * 9 - (teamsOnCell.length - 1) * 4.5}px, ${
                    index * 7 - (teamsOnCell.length - 1) * 3.5
                  }px)`,
                }}
                title={team.name}
              >
                {team.name.slice(0, 2)}
              </div>
            ))}
          </div>
        )
      })}
    </section>
  )
}
