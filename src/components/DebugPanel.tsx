import { BOARD_CELLS } from '../data/board'

interface DebugPanelProps {
  previewRoll: number
  onPreviewRollChange: (roll: number) => void
  onPreviewCell: (cellId: number) => void
}

export function DebugPanel({ previewRoll, onPreviewRollChange, onPreviewCell }: DebugPanelProps) {
  return (
    <section className="debug-panel">
      <div className="debug-panel-header">
        <strong>디버그: 칸 팝업 프리뷰</strong>
        <span>실제 게임에는 영향 없음</span>
      </div>

      <div className="debug-roll-toggle">
        <span>13번 테스트용 주사위</span>
        <button
          className={previewRoll % 2 === 0 ? 'debug-roll-button active' : 'debug-roll-button'}
          onClick={() => onPreviewRollChange(2)}
        >
          짝수 2
        </button>
        <button
          className={previewRoll % 2 === 1 ? 'debug-roll-button active' : 'debug-roll-button'}
          onClick={() => onPreviewRollChange(3)}
        >
          홀수 3
        </button>
      </div>

      <div className="debug-cell-grid">
        {BOARD_CELLS.filter((cell) => cell.id >= 1 && cell.id <= 30).map((cell) => (
          <button
            key={cell.id}
            className="debug-cell-button"
            title={`${cell.id}. ${cell.name} (${cell.type})`}
            onClick={() => onPreviewCell(cell.id)}
          >
            {cell.id}
          </button>
        ))}
      </div>
    </section>
  )
}
