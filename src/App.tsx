import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Board } from './components/Board'
import { Dice } from './components/Dice'
import { EventModal } from './components/EventModal'
import { ScoreBoard } from './components/ScoreBoard'
import { StartScreen } from './components/StartScreen'
import {
  BOARD_CELLS,
  FINISH_CELL_INDEX,
  getMoveAmountFromCellName,
  getNextPosition,
  getPrevPosition,
  LAP_SCORE,
  SHORTCUT_ENTER_FROM,
  SHORTCUT_START,
  SHOW_CELL_GUIDES,
} from './data/board'
import { getTeamMembers, pickRandomTeamMember, STAFF_MEMBERS } from './data/teamMembers'
import type { ModalState, Team } from './types'

const TEAM_COLORS = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#9775fa']
const ROLL_DURATION_MS = 1000
const TOKEN_STEP_DELAY_MS = 280

const oneshotEvents = [
  '풀잔으로 조원 다 같이 원샷',
  '베이스 다 같이 원샷',
  '일렉 다 같이 원샷',
  '보컬 다 같이 원샷',
  '26학번 다 같이 원샷',
  '걸린 조 빼고 다 같이 원샷',
  '짝수 술 / 홀수 음료수 마시기',
]

const gameEvents = [
  '소찬휘 Tears 80점 넘기',
  '더 게임 오브 데스 (조별 2명)',
  '초성게임 (조별 2명)',
  '어목조동 (조별 2명)',
]

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))
const randomDice = () => Math.floor(Math.random() * 6) + 1
const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const GOLD_KEY_FORWARD_MIN = 1
const GOLD_KEY_FORWARD_MAX = 3
const GOLD_KEY_BACK_MIN = 1
const GOLD_KEY_BACK_MAX = 2

function App() {
  const [screen, setScreen] = useState<'start' | 'game'>('start')
  const [teams, setTeams] = useState<Team[]>([])
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [diceValue, setDiceValue] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [modal, setModal] = useState<ModalState | null>(null)
  const teamsRef = useRef<Team[]>([])
  const currentTeamIndexRef = useRef(0)
  const chairmanMealUsedRef = useRef(false)

  useEffect(() => {
    teamsRef.current = teams
  }, [teams])

  useEffect(() => {
    currentTeamIndexRef.current = currentTeamIndex
  }, [currentTeamIndex])

  const updateTeams = (updater: (previousTeams: Team[]) => Team[]) => {
    const nextTeams = updater(teamsRef.current)
    teamsRef.current = nextTeams
    setTeams(nextTeams)
  }

  const startGame = (teamNames: string[]) => {
    const nextTeams = teamNames.map((name, index) => ({
      id: index,
      name,
      score: 0,
      position: 0,
      color: TEAM_COLORS[index],
      onShortcut: false,
    }))

    teamsRef.current = nextTeams
    setTeams(nextTeams)
    setCurrentTeamIndex(0)
    setDiceValue(null)
    setModal(null)
    chairmanMealUsedRef.current = false
    setScreen('game')
  }

  const resetGame = () => {
    teamsRef.current = []
    setTeams([])
    setCurrentTeamIndex(0)
    setDiceValue(null)
    setIsRolling(false)
    setModal(null)
    chairmanMealUsedRef.current = false
    setScreen('start')
  }

  const advanceTurn = () => {
    setModal(null)
    setCurrentTeamIndex((previousIndex) => (previousIndex + 1) % teamsRef.current.length)
  }

  const moveTeam = async (teamId: number, amount: number) => {
    const steps = Math.abs(amount)
    const forward = amount >= 0
    let position = teamsRef.current.find((current) => current.id === teamId)?.position ?? 0

    for (let step = 0; step < steps; step += 1) {
      const onShortcut =
        teamsRef.current.find((current) => current.id === teamId)?.onShortcut ?? false

      position = forward
        ? getNextPosition(position, onShortcut)
        : getPrevPosition(position, onShortcut)

      updateTeams((previousTeams) =>
        previousTeams.map((current) =>
          current.id === teamId ? { ...current, position } : current,
        ),
      )

      await delay(TOKEN_STEP_DELAY_MS)
      if (position >= FINISH_CELL_INDEX) break
    }

    return position
  }

  const executeDiceRoll = async (teamId?: number) => {
    const team =
      teamId !== undefined
        ? teamsRef.current.find((current) => current.id === teamId)
        : teamsRef.current[currentTeamIndexRef.current]

    if (!team) return

    setIsRolling(true)
    const intervalId = window.setInterval(() => setDiceValue(randomDice()), 80)

    await delay(ROLL_DURATION_MS)
    window.clearInterval(intervalId)

    const finalRoll = randomDice()
    setDiceValue(finalRoll)
    setIsRolling(false)

    const nextPosition = await moveTeam(team.id, finalRoll)
    processArrival(team.id, nextPosition, finalRoll, false)
  }

  const processGoldKey = (teamId: number, currentTeam: Team) => {
    const baseEvents = [
      'extra-roll',
      'forward',
      'back',
      'score-plus-20',
      'target-minus-10',
      'staff-drink',
    ] as const

    const availableEvents = chairmanMealUsedRef.current
      ? [...baseEvents]
      : [...baseEvents, 'chairman-meal' as const]

    const goldKeyEvent = randomItem(availableEvents)

    if (goldKeyEvent === 'chairman-meal') {
      chairmanMealUsedRef.current = true
      const members = getTeamMembers(teamId)
      setModal({
        title: '황금열쇠',
        message: '',
        spectacularReveal: {
          kind: 'chairman-meal',
          teamName: currentTeam.name,
          members,
          pickedMember: pickRandomTeamMember(members),
          onComplete: advanceTurn,
        },
        onConfirm: advanceTurn,
      })
      return
    }

    if (goldKeyEvent === 'staff-drink') {
      setModal({
        title: '황금열쇠',
        message: '',
        accent: '황금열쇠',
        memberPick: {
          accent: '황금열쇠',
          title: '황금열쇠',
          prompt: '운영진 중 랜덤으로 한잔해!',
          teamName: currentTeam.name,
          members: STAFF_MEMBERS,
          initialMember: pickRandomTeamMember(STAFF_MEMBERS),
          onReroll: () => processGoldKey(teamId, currentTeam),
          onComplete: advanceTurn,
        },
        onConfirm: advanceTurn,
      })
      return
    }

    if (goldKeyEvent === 'extra-roll') {
      setModal({
        title: '황금열쇠',
        message: '🎲 한 번 더 주사위!',
        accent: '황금열쇠',
        onConfirm: () => setModal(null),
      })
      void (async () => {
        await delay(700)
        setModal(null)
        await executeDiceRoll(teamId)
      })()
      return
    }

    if (goldKeyEvent === 'forward') {
      const forwardSteps = randomInt(GOLD_KEY_FORWARD_MIN, GOLD_KEY_FORWARD_MAX)
      setModal({
        title: '황금열쇠',
        message: `⏩ 앞으로 ${forwardSteps}칸 이동합니다.`,
        accent: '황금열쇠',
        onConfirm: async () => {
          setModal(null)
          const nextPosition = await moveTeam(teamId, forwardSteps)
          processArrival(teamId, nextPosition, undefined, false)
        },
      })
      return
    }

    if (goldKeyEvent === 'back') {
      const backSteps = randomInt(GOLD_KEY_BACK_MIN, GOLD_KEY_BACK_MAX)
      setModal({
        title: '황금열쇠',
        message: `⛔ 뒤로 ${backSteps}칸 이동합니다.`,
        accent: '황금열쇠',
        onConfirm: async () => {
          setModal(null)
          const nextPosition = await moveTeam(teamId, -backSteps)
          processArrival(teamId, nextPosition, undefined, true)
        },
      })
      return
    }

    if (goldKeyEvent === 'score-plus-20') {
      updateTeams((previousTeams) =>
        previousTeams.map((team) =>
          team.id === teamId ? { ...team, score: team.score + 20 } : team,
        ),
      )
      setModal({
        title: '황금열쇠',
        message: `💯 ${currentTeam.name} 조 점수 +20점!`,
        accent: '+20',
        onConfirm: advanceTurn,
      })
      return
    }

    setModal({
      title: '황금열쇠',
      message: '😈 원하는 조를 골라 -10점 감점하세요.',
      accent: '-10',
      requiresTarget: true,
      targetLabel: '감점할 팀 선택',
      onConfirm: (targetTeamId) => {
        if (targetTeamId !== undefined) {
          updateTeams((previousTeams) =>
            previousTeams.map((team) =>
              team.id === targetTeamId ? { ...team, score: team.score - 10 } : team,
            ),
          )
        }
        advanceTurn()
      },
    })
  }

  const processArrival = (
    teamId: number,
    position: number,
    arrivalRoll?: number,
    arrivedBackward = false,
  ) => {
    const cell = BOARD_CELLS[position]
    const currentTeam = teamsRef.current.find((team) => team.id === teamId)

    if (!currentTeam) {
      advanceTurn()
      return
    }

    if (cell.type === 'finish' || position === FINISH_CELL_INDEX) {
      updateTeams((previousTeams) =>
        previousTeams.map((team) =>
          team.id === teamId
            ? { ...team, score: team.score + LAP_SCORE, position: 0, onShortcut: false }
            : team,
        ),
      )
      setModal({
        title: '한 바퀴 완주!',
        message: `${currentTeam.name}이(가) 한 바퀴를 돌았습니다!\n완주 보너스 +${LAP_SCORE}점이 지급되었습니다.`,
        accent: 'FINISH',
        onConfirm: advanceTurn,
      })
      return
    }

    if (position === 11) {
      updateTeams((previousTeams) =>
        previousTeams.map((team) =>
          team.id === teamId ? { ...team, score: team.score + 15 } : team,
        ),
      )
      setModal({
        title: '+15 도착',
        message: '쉬어가는 턴도 있어야져~ 공짜 15점 나이스',
        accent: '+15',
        onConfirm: advanceTurn,
      })
      return
    }

    if (position === SHORTCUT_ENTER_FROM && !currentTeam.onShortcut) {
      const members = getTeamMembers(teamId)
      updateTeams((previousTeams) =>
        previousTeams.map((team) =>
          team.id === teamId ? { ...team, onShortcut: true } : team,
        ),
      )
      setModal({
        title: '소주 한 잔 도착',
        message: '',
        accent: '원샷',
        memberPick: {
          accent: '원샷',
          title: '소주 한 잔 도착',
          prompt: `${currentTeam.name} 팀에서 1명 랜덤으로 술 마시기!`,
          teamName: currentTeam.name,
          members,
          initialMember: pickRandomTeamMember(members),
          onComplete: advanceTurn,
        },
        onConfirm: advanceTurn,
      })
      return
    }

    if (cell.type === 'start' || cell.type === 'normal') {
      if (position >= SHORTCUT_START && position <= 29) {
        setModal({
          title: `${cell.name} 도착`,
          message: `지름길엔 대가가 따르죠 조원끼리 ${cell.name} !!`,
          accent: '지름길',
          onConfirm: advanceTurn,
        })
        return
      }

      advanceTurn()
      return
    }

    if (cell.type === 'oneshot') {
      if (position === 1) {
        updateTeams((previousTeams) =>
          previousTeams.map((team) =>
            team.id === teamId ? { ...team, score: team.score + 5 } : team,
          ),
        )
        setModal({
          title: '보컬 다같이 원샷 도착',
          message: '우리팀 보컬들 !! 일어나서 원샷!\n+5점',
          accent: '원샷',
          onConfirm: advanceTurn,
        })
        return
      }

      if (position === 7) {
        updateTeams((previousTeams) =>
          previousTeams.map((team) =>
            team.id === teamId ? { ...team, score: team.score + 5 } : team,
          ),
        )
        setModal({
          title: '드럼 원샷 도착',
          message: '우리팀 드럼은 일어나서 원샷!\n+5점',
          accent: '원샷',
          onConfirm: advanceTurn,
        })
        return
      }

      if (position === 16) {
        updateTeams((previousTeams) =>
          previousTeams.map((team) =>
            team.id === teamId ? { ...team, score: team.score + 5 } : team,
          ),
        )
        setModal({
          title: '베이스 원샷 도착',
          message: '우리팀 베이스는 일어나서 원샷!\n+5점',
          accent: '원샷',
          onConfirm: advanceTurn,
        })
        return
      }

      if (position === 17) {
        const members = getTeamMembers(teamId)
        setModal({
          title: '한명 지목 도착',
          message: '',
          accent: '지목',
          memberPick: {
            accent: '지목',
            title: '한명 지목 도착',
            prompt: '한명 지목! 너 마셔!',
            teamName: currentTeam.name,
            members,
            initialMember: pickRandomTeamMember(members),
            onComplete: advanceTurn,
          },
          onConfirm: advanceTurn,
        })
        return
      }

      if (position === 18) {
        updateTeams((previousTeams) =>
          previousTeams.map((team) =>
            team.id === teamId ? { ...team, score: team.score + 5 } : team,
          ),
        )
        setModal({
          title: '키보드 원샷 도착',
          message: '우리팀 키보드는 일어나서 원샷!!\n+5점',
          accent: '원샷',
          onConfirm: advanceTurn,
        })
        return
      }

      if (position === 13) {
        const message =
          arrivalRoll !== undefined
            ? arrivalRoll % 2 === 0
              ? '짝수 주사위로 도달했으면 술 마시기!'
              : '홀수 주사위로 도달했으면 콜라 마시기!'
            : '짝수 주사위로 도달했으면 술 마시기!\n홀수 주사위로 도달했으면 콜라 마시기!'

        setModal({
          title: '짝수/홀수 도착',
          message,
          accent: '원샷',
          onConfirm: advanceTurn,
        })
        return
      }

      const message =
        position === 8
          ? '노을 전체 잔들어!! 원샷'
            : position === 10
              ? '걸린 조 빼고 다같이 원샷!!'
              : position === 21
                ? '우리 새내기들 일어나! 한잔해~~'
                : randomItem(oneshotEvents)

      setModal({
        title: `${cell.name} 도착`,
        message,
        accent: '원샷',
        onConfirm: advanceTurn,
      })
      return
    }

    if (cell.type === 'game') {
      if (position === 9) {
        setModal({
          title: 'Tears 80점 도착',
          message: '팀원 중에 한명이 자신있는 노래 한소절 !! +20 점 실패 시 - 10점 !!',
          accent: '미션',
          missionResult: {
            successLabel: '미션 성공',
            failLabel: '미션 실패',
            onSuccess: () => {
              updateTeams((previousTeams) =>
                previousTeams.map((team) =>
                  team.id === teamId ? { ...team, score: team.score + 20 } : team,
                ),
              )
              advanceTurn()
            },
            onFail: () => {
              updateTeams((previousTeams) =>
                previousTeams.map((team) =>
                  team.id === teamId ? { ...team, score: team.score - 10 } : team,
                ),
              )
              advanceTurn()
            },
          },
          onConfirm: advanceTurn,
        })
        return
      }

      if (position === 26) {
        setModal({
          title: '랜덤 게임 도착',
          message: '걸린 팀에서 자신있는게임으로 랜덤 게임!! 이기면 +10점!!',
          accent: '미션',
          missionResult: {
            successLabel: '미션 성공',
            failLabel: '미션 실패',
            onSuccess: () => {
              updateTeams((previousTeams) =>
                previousTeams.map((team) =>
                  team.id === teamId ? { ...team, score: team.score + 10 } : team,
                ),
              )
              advanceTurn()
            },
            onFail: advanceTurn,
          },
          onConfirm: advanceTurn,
        })
        return
      }

      if (position === 19) {
        setModal({
          title: '훈민정음 도착',
          message: '각 조 2명씩 나와서 훈민 정음 훈민정음!',
          accent: '미션',
          requiresScoreAward: true,
          scoreAmount: 10,
          confirmLabel: '점수 반영',
          onConfirm: (winnerTeamId) => {
            if (winnerTeamId !== undefined) {
              updateTeams((previousTeams) =>
                previousTeams.map((team) =>
                  team.id === winnerTeamId ? { ...team, score: team.score + 10 } : team,
                ),
              )
            }
            advanceTurn()
          },
        })
        return
      }

      if (position === 15) {
        setModal({
          title: '게임 미션 도착',
          message: '각 조 2명씩 나와서 10점씩 걸고 더 게임 오브 데쓰!!',
          accent: '미션',
          requiresScoreAward: true,
          scoreAmount: 10,
          confirmLabel: '점수 반영',
          onConfirm: (winnerTeamId) => {
            if (winnerTeamId !== undefined) {
              updateTeams((previousTeams) =>
                previousTeams.map((team) =>
                  team.id === winnerTeamId ? { ...team, score: team.score + 10 } : team,
                ),
              )
            }
            advanceTurn()
          },
        })
        return
      }

      if (position === 2) {
        if (arrivedBackward) {
          advanceTurn()
          return
        }

        setModal({
          title: '미션 게임 도착',
          message: '각 조에서 2명씩 나와서 점수 10점 걸고 호빵,찐빵,대빵 게임!!',
          accent: '미션',
          requiresScoreAward: true,
          scoreAmount: 10,
          confirmLabel: '점수 반영',
          onConfirm: (winnerTeamId) => {
            if (winnerTeamId !== undefined) {
              updateTeams((previousTeams) =>
                previousTeams.map((team) =>
                  team.id === winnerTeamId ? { ...team, score: team.score + 10 } : team,
                ),
              )
            }
            advanceTurn()
          },
        })
        return
      }

      setModal({
        title: `${cell.name} 도착`,
        message: randomItem(gameEvents),
        accent: '미션',
        onConfirm: advanceTurn,
      })
      return
    }

    if (cell.type === 'guitar') {
      updateTeams((previousTeams) =>
        previousTeams.map((team) =>
          team.id === teamId ? { ...team, score: team.score + 5 } : team,
        ),
      )
      setModal({
        title: '기타 다같이 원샷 도착',
        message: '우리팀 기타들은 일어나서 다같이 원샷 !\n+5점',
        accent: '기타',
        onConfirm: advanceTurn,
      })
      return
    }

    if (cell.type === 'coupon') {
      if (position === 12) {
        setModal({
          title: '팀끼리 원샷 도착',
          message: '사랑하는 만큼~ 조원끼리 다같이 원샷',
          accent: '원샷',
          onConfirm: advanceTurn,
        })
        return
      }

      setModal({
        title: '운영진 쿠폰 획득',
        message: `${currentTeam.name} 운영진 쿠폰을 획득했습니다.`,
        accent: '쿠폰',
        onConfirm: advanceTurn,
      })
      return
    }

    if (cell.type === 'move') {
      if (position === 22) {
        const members = getTeamMembers(teamId)
        setModal({
          title: '러브샷 도착',
          message: '',
          accent: '러브샷',
          memberPick: {
            accent: '러브샷',
            title: '러브샷 도착',
            prompt: `${currentTeam.name} 팀에서 1명 랜덤으로`,
            teamName: currentTeam.name,
            members,
            initialMember: pickRandomTeamMember(members),
            finalMessage: '다른 팀원도 OK 원하는 사람 골라서 러브샷!!',
            onComplete: advanceTurn,
          },
          onConfirm: advanceTurn,
        })
        return
      }

      const moveAmount = getMoveAmountFromCellName(cell.name)
      const moveLabel = cell.name
      setModal({
        title: `${cell.name} 도착`,
        message: `${moveLabel} 이동합니다.`,
        accent: '이동',
        onConfirm: async () => {
          setModal(null)
          const nextPosition = await moveTeam(teamId, moveAmount)
          processArrival(teamId, nextPosition, undefined, moveAmount < 0)
        },
      })
      return
    }

    if (cell.type === 'goldkey') {
      processGoldKey(teamId, currentTeam)
      return
    }

    advanceTurn()
  }

  const rollDice = async () => {
    const currentTeam = teams[currentTeamIndex]
    if (!currentTeam || isRolling || modal) return

    await executeDiceRoll()
  }

  if (screen === 'start') {
    return <StartScreen onStart={startGame} />
  }

  const currentTeam = teams[currentTeamIndex]

  return (
    <main className="game-screen">
      <header className="game-header">
        <div>
          <p className="eyebrow">현재 턴</p>
          <h1 style={{ color: currentTeam?.color }}>{currentTeam?.name}</h1>
        </div>
      </header>

      <div className="game-layout">
        <Board teams={teams} showGuides={SHOW_CELL_GUIDES} />

        <aside className="side-panel">
          <Dice value={diceValue} isRolling={isRolling} disabled={isRolling || Boolean(modal)} onRoll={rollDice} />
          <ScoreBoard teams={teams} currentTeamId={currentTeam?.id ?? 0} />
        </aside>
      </div>

      {modal && <EventModal modal={modal} teams={teams} currentTeamId={currentTeam?.id ?? 0} />}
    </main>
  )
}

export default App
