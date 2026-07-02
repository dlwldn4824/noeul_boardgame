export type CellType =
  | 'start'
  | 'oneshot'
  | 'game'
  | 'move'
  | 'goldkey'
  | 'coupon'
  | 'guitar'
  | 'normal'
  | 'finish'

export interface BoardCell {
  id: number
  name: string
  type: CellType
  x: number
  y: number
}

export interface Team {
  id: number
  name: string
  score: number
  position: number
  color: string
  /** 완주한 바퀴 수 */
  laps: number
  /** 5번 칸에 정확히 멈춰 지름길 경로로 진입한 상태 */
  onShortcut: boolean
}

export interface ModalState {
  title: string
  message: string
  accent?: string
  requiresTarget?: boolean
  targetLabel?: string
  confirmLabel?: string
  /** true면 먼저 안내 후 '점수입력하기'로 승리 팀 선택 */
  requiresScoreAward?: boolean
  scoreAmount?: number
  /** 미션 성공/실패 버튼 표시 */
  missionResult?: {
    successLabel?: string
    failLabel?: string
    onSuccess: () => void | Promise<void>
    onFail: () => void | Promise<void>
  }
  /** 팀원 랜덤 추첨 (러브샷, 소주 한 잔 등) */
  memberPick?: {
    accent: string
    title: string
    prompt: string
    teamName: string
    members: string[]
    initialMember: string
    /** 있으면 확인 후 2단계 팝업, 없으면 확인 즉시 완료 */
    finalMessage?: string
    /** 있으면 '이 자리에 없어요' 시 멤버 재추첨 대신 이 콜백 실행 */
    onReroll?: () => void
    onComplete: () => void | Promise<void>
  }
  /** 황금열쇠 대박 연출 (게임당 1회) */
  spectacularReveal?: {
    kind: 'chairman-meal'
    teamName: string
    members: string[]
    pickedMember: string
    onComplete: () => void | Promise<void>
  }
  /** 두 팀 점수 교환 (황금열쇠) */
  scoreSwap?: {
    firstLabel?: string
    secondLabel?: string
    onConfirm: (firstTeamId: number, secondTeamId: number) => void | Promise<void>
  }
  onConfirm: (targetTeamId?: number) => void | Promise<void>
}
