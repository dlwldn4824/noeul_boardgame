import type { BoardCell } from '../types'

export const BOARD_CELLS: BoardCell[] = [
  { id: 0, name: 'START', type: 'start', x: 7.2, y: 88.5 },
  { id: 1, name: '보컬 다같이 원샷', type: 'oneshot', x: 20.8, y: 88.5 },
  { id: 2, name: '미션 게임', type: 'game', x: 32.9, y: 88.5 },
  { id: 3, name: '한 칸 뒤로', type: 'move', x: 45.0, y: 88.5 },
  { id: 4, name: '황금열쇠', type: 'goldkey', x: 56.5, y: 88.5 },
  { id: 5, name: '소주 한 잔', type: 'normal', x: 68.2, y: 88.5 },
  { id: 6, name: '기타 다같이 원샷', type: 'guitar', x: 79.7, y: 88.5 },
  { id: 7, name: '드럼 원샷', type: 'oneshot', x: 92.9, y: 88.5 },
  { id: 8, name: '노을 원샷', type: 'oneshot', x: 92.9, y: 73.5 },
  { id: 9, name: 'Tears 80점', type: 'game', x: 92.9, y: 58.2 },
  { id: 10, name: '걸린 조 빼고 다같이 원샷', type: 'oneshot', x: 92.9, y: 43.1 },
  { id: 11, name: '+15', type: 'normal', x: 92.9, y: 27.9 },
  { id: 12, name: '팀끼리 원샷', type: 'coupon', x: 92.9, y: 9.2 },
  { id: 13, name: '짝수/홀수', type: 'oneshot', x: 80.0, y: 9.2 },
  { id: 14, name: '황금열쇠', type: 'goldkey', x: 68.2, y: 9.2 },
  { id: 15, name: '게임 미션', type: 'game', x: 56.0, y: 9.2 },
  { id: 16, name: '베이스 원샷', type: 'oneshot', x: 44.5, y: 9.2 },
  { id: 17, name: '한명 지목', type: 'oneshot', x: 32.4, y: 9.2 },
  { id: 18, name: '키보드 원샷', type: 'oneshot', x: 21.2, y: 9.2 },
  { id: 19, name: '훈민정음', type: 'game', x: 7.4, y: 9.2 },
  { id: 20, name: '황금열쇠', type: 'goldkey', x: 7.4, y: 28.2 },
  { id: 21, name: '26학번 원샷', type: 'oneshot', x: 7.4, y: 42.0 },
  { id: 22, name: '러브샷', type: 'move', x: 7.4, y: 57.8 },
  { id: 23, name: '세 칸 뒤로', type: 'move', x: 7.4, y: 72.5 },
  { id: 24, name: '소주3잔', type: 'normal', x: 67.3, y: 75.2 },
  { id: 25, name: '소주2잔', type: 'normal', x: 64.8, y: 65.4 },
  { id: 26, name: '랜덤 게임', type: 'game', x: 62.5, y: 55.2 },
  { id: 27, name: '소주3잔', type: 'normal', x: 60.7, y: 44.0 },
  { id: 28, name: '소주2잔', type: 'normal', x: 58.8, y: 34.0 },
  { id: 29, name: '소주1잔', type: 'normal', x: 56.8, y: 24.0 },
  { id: 30, name: 'FINISH', type: 'finish', x: 7.4, y: 88.5 },

]

export const LAST_CELL_INDEX = BOARD_CELLS.length - 1
export const FINISH_CELL_INDEX = 30
export const LAP_SCORE = 20
export const LAP_COUNT_TO_WIN = 2

/** 5번 칸에 정확히 멈추면 진입하는 지름길 칸 (첫 칸) */
export const SHORTCUT_ENTER_FROM = 5
export const SHORTCUT_START = 24
/** 지름길 마지막 칸(29) 다음에 이어지는 일반 경로 칸 */
export const SHORTCUT_EXIT_TO = 15

const KOREAN_MOVE_NUMBERS: Record<string, number> = {
  한: 1,
  두: 2,
  세: 3,
  네: 4,
}

/** '한 칸 뒤로', '세 칸 뒤로' 등 칸 이름에서 뒤로 이동 칸수를 읽는다 */
export function getMoveAmountFromCellName(name: string): number {
  const digitMatch = name.match(/(\d+)\s*칸?\s*뒤로/)
  if (digitMatch) return -Number(digitMatch[1])

  for (const [korean, amount] of Object.entries(KOREAN_MOVE_NUMBERS)) {
    if (name.includes(korean) && name.includes('뒤로')) return -amount
  }

  return -1
}

/**
 * 앞으로 한 칸 이동할 때 다음 칸 번호를 계산한다.
 * onShortcut(지름길 모드)일 때만 특수 경로를 따른다.
 *  - 5 -> 24 -> 25 -> 26 -> 27 -> 28 -> 29 -> 15 -> 16 -> 17 -> ...(일반 복귀)
 */
export function getNextPosition(current: number, onShortcut: boolean): number {
  if (onShortcut) {
    if (current === SHORTCUT_ENTER_FROM) return SHORTCUT_START
    if (current >= SHORTCUT_START && current <= 28) return current + 1
    if (current === 29) return SHORTCUT_EXIT_TO
  }
  return current + 1
}

/**
 * 뒤로 한 칸 이동할 때 이전 칸 번호를 계산한다.
 * 지름길 경로도 앞으로 이동의 역방향을 따른다.
 */
export function getPrevPosition(current: number, onShortcut: boolean): number {
  if (current <= 0) return 0

  if (onShortcut) {
    if (current === SHORTCUT_START) return SHORTCUT_ENTER_FROM
    if (current > SHORTCUT_START && current <= 29) return current - 1
    if (current === SHORTCUT_EXIT_TO) return 29
  }

  return current - 1
}

/** 위치 맞출 때만 true로 바꾸면 칸 번호 가이드가 보입니다 */
export const SHOW_CELL_GUIDES = false
