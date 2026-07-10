import { useId, useRef, useState } from 'react'

interface ChartPoint {
  date: string // YYYY-MM-DD
  value: number
}

interface PortfolioChartProps {
  points: ChartPoint[]
}

const WIDTH = 480
const HEIGHT = 170
// 왼쪽은 금액 라벨, 아래는 날짜 라벨이 들어갈 자리
const PAD = { top: 14, right: 12, bottom: 22, left: 52 }
const PLOT_WIDTH = WIDTH - PAD.left - PAD.right
const PLOT_HEIGHT = HEIGHT - PAD.top - PAD.bottom

function formatMoneyShort(value: number): string {
  // 축 라벨용 축약 표기 — 1,234만원 단위면 충분히 구분된다
  return `${Math.round(value / 10_000).toLocaleString('ko-KR')}만`
}

function formatMoneyFull(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

function formatDateShort(iso: string): string {
  const [, month, day] = iso.split('-')
  return `${Number(month)}.${Number(day)}`
}

// Catmull-Rom 스플라인을 cubic bezier 로 변환해 부드러운 곡선 path 를 만든다.
// 데이터 포인트를 정확히 지나가면서 각진 꺾임만 없애는 표준 기법(의존성 없음).
function buildSmoothPath(coords: { x: number; y: number }[]): string {
  if (coords.length < 2) return ''
  const path: string[] = [`M ${coords[0].x} ${coords[0].y}`]
  for (let i = 0; i < coords.length - 1; i += 1) {
    const p0 = coords[i - 1] ?? coords[i]
    const p1 = coords[i]
    const p2 = coords[i + 1]
    const p3 = coords[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    path.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`)
  }
  return path.join(' ')
}

// 순수 SVG 라인 차트 — 곡선 스무딩 + 영역 그라디언트 + 그리드/축 라벨 + 호버 툴팁.
// 값이 늘었으면 rise(빨강), 줄었으면 fall(파랑) — 등락 색은 브랜드 그린과 분리한다는
// PLAN.md §6 원칙을 그래프에도 그대로 적용한다(색은 svg 의 currentColor 하나로 제어).
function PortfolioChart({ points }: PortfolioChartProps) {
  const gradientId = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  if (points.length < 2) return null

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  // 위아래 5% 여유를 줘서 선이 프레임에 딱 붙지 않게 한다
  const pad = (max - min || max * 0.01) * 0.05
  const yMin = min - pad
  const yMax = max + pad
  const range = yMax - yMin

  const stepX = PLOT_WIDTH / (points.length - 1)
  const toX = (index: number) => PAD.left + index * stepX
  const toY = (value: number) => PAD.top + (1 - (value - yMin) / range) * PLOT_HEIGHT

  const coords = points.map((point, index) => ({ x: toX(index), y: toY(point.value) }))
  const linePath = buildSmoothPath(coords)
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${PAD.top + PLOT_HEIGHT} L ${coords[0].x} ${PAD.top + PLOT_HEIGHT} Z`

  const isUp = values[values.length - 1] >= values[0]
  const lastCoord = coords[coords.length - 1]

  // 그리드 3줄(최소·중간·최대) — 라벨은 실제 데이터 기준값으로
  const gridValues = [min, (min + max) / 2, max]

  // x축 날짜 라벨 — 처음·중간·끝 3개만 담백하게
  const xLabelIndices = [0, Math.floor((points.length - 1) / 2), points.length - 1]

  // 마우스 이동·클릭·모바일 탭 공용 — 포인터 위치에서 가장 가까운 데이터 포인트를 고른다.
  // 기존엔 pointermove 에만 걸려 있어 클릭/탭으로는 툴팁이 뜨지 않는 버그가 있었다.
  function handlePointerLocate(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    // 화면 좌표 → viewBox 좌표로 환산한 뒤 가장 가까운 데이터 포인트를 찾는다
    const x = ((event.clientX - rect.left) / rect.width) * WIDTH
    const index = Math.round((x - PAD.left) / stepX)
    setHoverIndex(Math.min(Math.max(index, 0), points.length - 1))
  }

  // 터치는 손을 떼는 순간 pointerleave 가 따라오므로 마우스일 때만 툴팁을 지운다 —
  // 안 그러면 모바일에서 탭하자마자 툴팁이 사라진다.
  function handlePointerLeave(event: React.PointerEvent<SVGSVGElement>) {
    if (event.pointerType === 'mouse') setHoverIndex(null)
  }

  const hovered =
    hoverIndex != null ? { point: points[hoverIndex], coord: coords[hoverIndex] } : null
  // 툴팁이 오른쪽 밖으로 나가지 않게 뒤쪽 절반에서는 왼쪽으로 펼친다
  const tooltipFlip = hovered != null && hovered.coord.x > WIDTH * 0.62

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={`h-40 w-full touch-none ${isUp ? 'text-rise' : 'text-fall'}`}
      role="img"
      aria-label="최근 거래일 총 평가액 추이 그래프"
      onPointerDown={handlePointerLocate}
      onPointerMove={handlePointerLocate}
      onPointerLeave={handlePointerLeave}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity={0.22} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* 그리드 + y축 금액 라벨 */}
      {gridValues.map((value) => (
        <g key={value}>
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={toY(value)}
            y2={toY(value)}
            className="stroke-line"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <text
            x={PAD.left - 6}
            y={toY(value) + 3}
            textAnchor="end"
            className="fill-muted text-[9px]"
          >
            {formatMoneyShort(value)}
          </text>
        </g>
      ))}

      {/* x축 날짜 라벨 */}
      {xLabelIndices.map((index) => (
        <text
          key={points[index].date}
          x={toX(index)}
          y={HEIGHT - 6}
          textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
          className="fill-muted text-[9px]"
        >
          {formatDateShort(points[index].date)}
        </text>
      ))}

      {/* 영역 그라디언트 + 곡선 */}
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 마지막 값 강조점 */}
      <circle cx={lastCoord.x} cy={lastCoord.y} r={4} fill="currentColor" />
      <circle cx={lastCoord.x} cy={lastCoord.y} r={7} fill="currentColor" opacity={0.2} />

      {/* 호버 — 세로 가이드선 + 포인트 + 툴팁 */}
      {hovered && (
        <g>
          <line
            x1={hovered.coord.x}
            x2={hovered.coord.x}
            y1={PAD.top}
            y2={PAD.top + PLOT_HEIGHT}
            className="stroke-subtle"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <circle
            cx={hovered.coord.x}
            cy={hovered.coord.y}
            r={4.5}
            fill="currentColor"
            className="stroke-surface"
            strokeWidth={2}
          />
          <g
            transform={`translate(${tooltipFlip ? hovered.coord.x - 118 : hovered.coord.x + 10}, ${PAD.top})`}
          >
            <rect width={108} height={36} rx={7} className="fill-ink" opacity={0.92} />
            <text x={10} y={15} className="fill-bg text-[9px]">
              {formatDateShort(hovered.point.date)}
            </text>
            <text x={10} y={28} className="fill-bg text-[10px] font-semibold">
              {formatMoneyFull(hovered.point.value)}
            </text>
          </g>
        </g>
      )}
    </svg>
  )
}

export default PortfolioChart
