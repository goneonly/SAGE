import Reveal from '../Reveal'
import Badge from '../../../components/ui/Badge'

// 레벨별 설명 미리보기 — 같은 용어(코스피)가 레벨에 따라 어떻게 달라지는지 발췌
const LEVEL_PREVIEWS = [
  {
    level: '초보',
    text: '우리나라 주식시장의 "건강 점수판" 같은 것. 이 숫자가 오르면 대체로 시장 전체가 좋아졌다는 뜻.',
  },
  {
    level: '중급',
    text: '유가증권시장 전체 종목의 시가총액을 기준 시점(1980년=100)과 비교해 산출하는 시가총액 가중 지수.',
  },
  {
    level: '고급',
    text: '시총 가중이라 대형주 쏠림이 크고, 코스피200 선물·옵션 베이시스를 함께 봐야 방향성 판단이 정확함.',
  },
]

// 3. 레벨 맞춤 설명 — 초보/중급/고급 카드 3장을 스태거로 노출한다.
function LevelPreviewSection() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold leading-snug text-ink md:text-4xl">
            같은 뉴스도,
            <br />내 레벨에 맞는 설명으로.
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-6 text-base leading-relaxed text-muted">
            초보·중급·고급 — 같은 용어도 당신이 고른 레벨에 따라 완전히 다르게 읽혀요.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          {LEVEL_PREVIEWS.map((preview, index) => (
            <Reveal key={preview.level} delay={index * 150}>
              <div className="h-full rounded-2xl border border-line bg-surface p-6">
                <Badge className="px-3 py-1">{preview.level}</Badge>
                <p className="mt-4 text-sm leading-relaxed text-ink">{preview.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LevelPreviewSection
