import { useState } from 'react'
import { TEAM_MEMBERS_BY_ID } from '../data/teamMembers'

interface StartScreenProps {
  onStart: (teamNames: string[]) => void
}

const DEFAULT_TEAMS = ['1조', '2조', '3조', '4조', '5조']

export function StartScreen({ onStart }: StartScreenProps) {
  const [teamNames, setTeamNames] = useState(DEFAULT_TEAMS)

  const handleChange = (index: number, value: string) => {
    setTeamNames((prev) => prev.map((name, teamIndex) => (teamIndex === index ? value : name)))
  }

  const handleStart = () => {
    const activeTeams = teamNames.map((name) => name.trim()).filter(Boolean).slice(0, 5)
    onStart(activeTeams.length > 0 ? activeTeams : DEFAULT_TEAMS)
  }

  return (
    <main className="start-screen">
      <section className="start-card team-setup-card">
        <p className="eyebrow">MT / 동아리 행사 보드게임</p>
        <h1>NOEUL 주루마블</h1>
        <p className="start-description">팀명을 확인하고 게임을 시작하세요.</p>

        <div className="team-inputs">
          {teamNames.map((teamName, index) => (
            <article key={index} className="team-setup-row">
              <label className="team-input-label">
                <span>{index + 1}팀</span>
                <input
                  value={teamName}
                  onChange={(event) => handleChange(index, event.target.value)}
                  maxLength={12}
                  placeholder={`${index + 1}조`}
                />
              </label>
              <p className="team-roster">
                {TEAM_MEMBERS_BY_ID[index]?.join(' · ') ?? '명단 없음'}
              </p>
            </article>
          ))}
        </div>

        <button className="primary-button" onClick={handleStart}>
          게임 시작
        </button>
      </section>
    </main>
  )
}
