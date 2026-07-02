import type { ModalState } from '../types'
import type { Team } from '../types'

export const IS_LOCAL_DEV = import.meta.env.DEV

/** 턴 사이 잠깐 쉬는 시간 */
export const SIMULATION_TURN_GAP_MS = 500

/** 일반 이벤트 팝업 읽는 시간 */
export const SIMULATION_MODAL_DELAY_MS = 1800

/** 멤버 뽑기 룰렛 (useMemberRoulette 5초 + 여유) */
export const SIMULATION_ROULETTE_DELAY_MS = 5500

/** 회장님 밥 잭팟 (드럼롤 2.4초 + 룰렛 5초 + 여유) */
export const SIMULATION_SPECTACULAR_DELAY_MS = 8200

export function getSimulationModalDelay(modal: ModalState): number {
  if (modal.spectacularReveal) return SIMULATION_SPECTACULAR_DELAY_MS
  if (modal.memberPick) return SIMULATION_ROULETTE_DELAY_MS
  if (modal.requiresScoreAward) return SIMULATION_MODAL_DELAY_MS + 1200
  if (modal.scoreSwap) return SIMULATION_MODAL_DELAY_MS + 600
  return SIMULATION_MODAL_DELAY_MS
}

export async function autoResolveModal(
  modal: ModalState,
  teams: Team[],
  currentTeamId: number,
): Promise<void> {
  if (modal.spectacularReveal) {
    await modal.spectacularReveal.onComplete()
    return
  }

  if (modal.memberPick) {
    await modal.memberPick.onComplete()
    return
  }

  if (modal.missionResult) {
    await modal.missionResult.onSuccess()
    return
  }

  if (modal.scoreSwap) {
    const firstTeamId = teams[0]?.id ?? 0
    const secondTeamId = teams[1]?.id ?? firstTeamId
    await modal.scoreSwap.onConfirm(firstTeamId, secondTeamId)
    return
  }

  if (modal.requiresScoreAward) {
    await modal.onConfirm(currentTeamId)
    return
  }

  if (modal.requiresTarget) {
    const targetTeam = teams.find((team) => team.id !== currentTeamId) ?? teams[0]
    await modal.onConfirm(targetTeam?.id)
    return
  }

  await modal.onConfirm()
}
