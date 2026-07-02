import { useState } from 'react'

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
      <section className="start-card">
        <p className="eyebrow">MT / 동아리 행사 보드게임</p>
        <h1>NOEUL 주루마블</h1>
        <p className="start-description">
          최대 5개 팀명을 입력하고, 순서대로 주사위를 굴려 보드판을 이동하세요.
        </p>

        <div className="team-inputs">
          {teamNames.map((teamName, index) => (
            <label key={index} className="team-input-label">
              <span>{index + 1}팀</span>
              <input
                value={teamName}
                onChange={(event) => handleChange(index, event.target.value)}
                maxLength={12}
                placeholder={`${index + 1}조`}
              />
            </label>
          ))}
        </div>

        <button className="primary-button" onClick={handleStart}>
          게임 시작
        </button>
      </section>
    </main>
  )
}
