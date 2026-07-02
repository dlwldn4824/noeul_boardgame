import { useEffect, useMemo, useState } from 'react'
import { pickRandomTeamMember } from '../data/teamMembers'
import { useMemberRoulette } from '../hooks/useMemberRoulette'
import { SpectacularGoldKeyModal } from './SpectacularGoldKeyModal'
import type { ModalState, Team } from '../types'

interface EventModalProps {
  modal: ModalState
  teams: Team[]
  currentTeamId: number
}

export function EventModal({ modal, teams, currentTeamId }: EventModalProps) {
  const [isSelectingWinner, setIsSelectingWinner] = useState(false)
  const [pickedMember, setPickedMember] = useState('')
  const [rollKey, setRollKey] = useState(0)
  const [memberPickPhase, setMemberPickPhase] = useState<'pick' | 'confirm'>('pick')

  const selectableTeams = useMemo(
    () => teams.filter((team) => team.id !== currentTeamId),
    [currentTeamId, teams],
  )
  const targetOptions = selectableTeams.length > 0 ? selectableTeams : teams
  const scoreAwardOptions = teams
  const [targetTeamId, setTargetTeamId] = useState<number>(
    modal.requiresScoreAward
      ? (scoreAwardOptions[0]?.id ?? teams[0]?.id)
      : (targetOptions[0]?.id ?? teams[0]?.id),
  )

  useEffect(() => {
    if (modal.memberPick) {
      setPickedMember(modal.memberPick.initialMember)
      setRollKey((previous) => previous + 1)
      setMemberPickPhase('pick')
    }
  }, [modal.memberPick])

  const memberPickMembers = modal.memberPick?.members ?? []
  const { displayName, isRolling } = useMemberRoulette(
    memberPickMembers,
    pickedMember,
    rollKey,
  )

  const handleConfirm = () => {
    modal.onConfirm(modal.requiresTarget || isSelectingWinner ? targetTeamId : undefined)
  }

  const showScoreSelector = modal.requiresScoreAward && isSelectingWinner

  if (modal.spectacularReveal?.kind === 'chairman-meal') {
    const currentTeam = teams.find((team) => team.id === currentTeamId)
    return (
      <SpectacularGoldKeyModal
        teamName={currentTeam?.name ?? '걸린 팀'}
        onComplete={modal.spectacularReveal.onComplete}
      />
    )
  }

  if (modal.memberPick) {
    if (memberPickPhase === 'confirm' && modal.memberPick.finalMessage) {
      return (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <section className="event-modal">
            <p className="modal-accent">{modal.memberPick.accent}</p>
            <h2>{modal.memberPick.title}</h2>
            <p className="modal-message">{modal.memberPick.finalMessage}</p>
            <button className="primary-button" onClick={modal.memberPick.onComplete}>
              확인
            </button>
          </section>
        </div>
      )
    }

    const handleMemberPickConfirm = () => {
      if (modal.memberPick?.finalMessage) {
        setMemberPickPhase('confirm')
        return
      }
      modal.memberPick?.onComplete()
    }

    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true">
        <section className="event-modal">
          <p className="modal-accent">{modal.memberPick.accent}</p>
          <h2>{modal.memberPick.title}</h2>
          <p className="modal-message">{modal.memberPick.prompt}</p>
          <p
            className={
              isRolling ? 'love-shot-name rolling' : 'love-shot-name revealed'
            }
          >
            {displayName}
          </p>
          <div className="love-shot-buttons">
            <button
              className="secondary-button love-shot-reroll-button"
              disabled={isRolling}
              onClick={() => {
                setPickedMember(
                  pickRandomTeamMember(modal.memberPick!.members, pickedMember),
                )
                setRollKey((previous) => previous + 1)
              }}
            >
              이 자리에 없어요
            </button>
            <button
              className="primary-button"
              disabled={isRolling}
              onClick={handleMemberPickConfirm}
            >
              확인
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="event-modal">
        <p className="modal-accent">{modal.accent ?? 'EVENT'}</p>
        <h2>{modal.title}</h2>
        <p className="modal-message">{modal.message}</p>

        {modal.requiresTarget && (
          <label className="target-selector">
            {modal.targetLabel ?? '감점할 팀 선택'}
            <select
              value={targetTeamId}
              onChange={(event) => setTargetTeamId(Number(event.target.value))}
            >
              {targetOptions.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {showScoreSelector && (
          <label className="target-selector">
            {modal.scoreAmount ?? 10}점 가져갈 팀 선택
            <select
              value={targetTeamId}
              onChange={(event) => setTargetTeamId(Number(event.target.value))}
            >
              {scoreAwardOptions.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {modal.missionResult ? (
          <div className="mission-result-buttons">
            <button className="primary-button" onClick={modal.missionResult.onSuccess}>
              {modal.missionResult.successLabel ?? '미션 성공'}
            </button>
            <button className="secondary-button mission-fail-button" onClick={modal.missionResult.onFail}>
              {modal.missionResult.failLabel ?? '미션 실패'}
            </button>
          </div>
        ) : modal.requiresScoreAward && !isSelectingWinner ? (
          <button className="primary-button" onClick={() => setIsSelectingWinner(true)}>
            점수입력하기
          </button>
        ) : (
          <button className="primary-button" onClick={handleConfirm}>
            {modal.confirmLabel ?? '확인'}
          </button>
        )}
      </section>
    </div>
  )
}
