interface PortfolioChartProps {
  points: { date: string; value: number }[]
}

const WIDTH = 480
const HEIGHT = 120
const PADDING = 8

// 의존성 추가 없이 순수 SVG로 그리는 가벼운 라인 차트(스파크라인). 값이 늘었으면 rise(빨강),
// 줄었으면 fall(파랑) — 등락 색은 브랜드 그린과 분리한다는 PLAN.md §6 원칙을 그래프에도 그대로 적용.
function PortfolioChart({ points }: PortfolioChartProps) {
  if (points.length < 2) return null

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const stepX = (WIDTH - PADDING * 2) / (points.length - 1)
  const toY = (value: number) => HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2)

  const linePoints = points
    .map((point, index) => `${PADDING + index * stepX},${toY(point.value)}`)
    .join(' ')

  const isUp = values[values.length - 1] >= values[0]
  const strokeClassName = isUp ? 'stroke-rise' : 'stroke-fall'

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-28 w-full"
      role="img"
      aria-label="최근 거래일 총 평가액 추이 그래프"
    >
      <polyline points={linePoints} fill="none" strokeWidth={2} className={strokeClassName} />
      {points.map((point, index) => (
        <circle
          key={point.date}
          cx={PADDING + index * stepX}
          cy={toY(point.value)}
          r={2.5}
          className={isUp ? 'fill-rise' : 'fill-fall'}
        />
      ))}
    </svg>
  )
}

export default PortfolioChart
