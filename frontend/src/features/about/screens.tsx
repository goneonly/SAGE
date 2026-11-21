import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Icon from '../../components/Icon'
import { LEVEL_NAME, LEVELS } from '../../lib/levels'
import { cn } from '../../lib/cn'
import type { Level } from '../../types/auth'

// 브라우저 창 속 화면 예시 — 앱의 기사 화면·설명 패널·단어장을 가짜 데이터로 작게 그린다.
// 실제 데이터나 API 를 쓰지 않는다(소개용 정적 데모).

type TermKey = 'netbuy' | 'fx' | 'kospi'

const TERMS: Record<TermKey, { word: string; explain: Record<Level, string>; impact: string }> = {
  netbuy: {
    word: '순매수',
    explain: {
      beginner:
        '판 것보다 산 게 더 많다는 뜻이에요. 외국인이 한국 주식을 "사는 쪽"에 섰다는 신호예요.',
      intermediate:
        '일정 기간 매수 금액이 매도 금액보다 큰 상태. 누가 사고 있는지 보여 주는 수급 지표로 쓰여요.',
      advanced:
        '외국인 순매수는 환율·글로벌 위험선호와 함께 움직여요. 연속성 여부가 추세 판단의 핵심이에요.',
    },
    impact: '외국인 매수가 이어지면 대형주 중심으로 지수를 끌어올리는 힘이 돼요.',
  },
  fx: {
    word: '환율',
    explain: {
      beginner: '원화와 달러를 바꾸는 비율이에요. 환율이 내려가면 원화 값이 올랐다는 뜻이에요.',
      intermediate:
        '원·달러 환율 하락(원화 강세)은 외국인 입장에서 환차익 기대를 키워 국내 주식 매수를 부르기도 해요.',
      advanced:
        '환율 하락은 외국인 자금 유입과 맞물리지만, 수출주 실적에는 부담이 될 수 있어 업종별로 효과가 달라요.',
    },
    impact: '원화 강세가 이어지면 외국인 자금이 더 들어올 여지가 생겨요.',
  },
  kospi: {
    word: '코스피',
    explain: {
      beginner:
        '우리나라 주식시장의 "건강 점수판" 같은 것. 이 숫자가 오르면 대체로 시장 전체가 좋아졌다는 뜻이에요.',
      intermediate:
        '유가증권시장 전체 종목의 시가총액을 기준 시점(1980년=100)과 비교해 산출하는 시가총액 가중 지수예요.',
      advanced:
        '시총 가중이라 대형주 쏠림이 크고, 코스피200 선물·옵션 베이시스를 함께 봐야 방향성 판단이 정확해요.',
    },
    impact: '반도체 대형주가 오르면 지수 전체가 크게 움직여요.',
  },
}

// 기사 머리 — 출처·날짜·제목
function ArticleHeader() {
  return (
    <>
      <p className="text-[11px] text-muted">한국경제 · 2026년 6월 29일</p>
      <h4 className="mt-1.5 text-base font-bold leading-snug text-ink md:text-lg">
        코스피, 외국인 매수세에 2650선 회복
      </h4>
      <p className="mt-1 text-xs font-semibold text-rise">코스피 2,650.12 ▲ 1.2%</p>
    </>
  )
}

interface TermProps {
  term: TermKey
  active?: boolean
  /** 넘기면 눌러 볼 수 있는 버튼, 없으면 표시만 */
  onSelect?: (term: TermKey) => void
}

// 기사 속 하이라이트 용어 — 앱의 하이라이트(HighlightText)와 같은 모양
function Term({ term, active, onSelect }: TermProps) {
  const className = cn(
    'rounded px-0.5 font-medium text-primary-700 underline decoration-primary-700 decoration-2 underline-offset-2 transition-colors',
    active ? 'bg-primary-200' : 'bg-primary-100',
    onSelect && 'cursor-pointer hover:bg-primary-200',
  )
  if (!onSelect) return <span className={className}>{TERMS[term].word}</span>
  return (
    <button type="button" className={className} onClick={() => onSelect(term)}>
      {TERMS[term].word}
    </button>
  )
}

function ArticleBody({
  active,
  onSelect,
}: {
  active?: TermKey | null
  onSelect?: TermProps['onSelect']
}) {
  return (
    <p className="mt-4 text-sm leading-loose text-ink">
      코스피가 외국인 <Term term="netbuy" active={active === 'netbuy'} onSelect={onSelect} />에
      힘입어 2,650선을 회복했다. 원·달러{' '}
      <Term term="fx" active={active === 'fx'} onSelect={onSelect} />이 하락하며 외국인 자금이
      들어온 영향으로, 반도체 대형주가{' '}
      <Term term="kospi" active={active === 'kospi'} onSelect={onSelect} /> 상승을 이끌었다.
      증권가는 당분간 외국인 수급이 지수 방향을 가를 것으로 내다봤다.
    </p>
  )
}

// 설명 패널 — 앱의 ParaphrasePanel 과 같은 구성(설명 + 투자 영향)
function ExplainPanel({ term, level = 'beginner' }: { term: TermKey; level?: Level }) {
  const data = TERMS[term]
  return (
    <div className="rounded-xl border border-line bg-bg p-4 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-ink">{data.word}</p>
        <Badge>{LEVEL_NAME[level]}</Badge>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{data.explain[level]}</p>
      <div className="mt-3 flex gap-2 rounded-lg bg-primary-50 p-2.5">
        <Icon name="lightbulb" className="mt-0.5 h-4 w-4 text-primary-700" />
        <p className="text-xs leading-relaxed text-ink">{data.impact}</p>
      </div>
    </div>
  )
}

/** 1. 기사 화면 — 어려운 용어에 하이라이트가 켜진 모습 */
export function ArticleScreen() {
  return (
    <div className="h-full p-5 md:p-7">
      <ArticleHeader />
      <ArticleBody />
      <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-700">
        <Icon name="lightbulb" className="h-3.5 w-3.5" />
        AI가 설명이 필요한 용어 3개를 찾았어요
      </p>
    </div>
  )
}

/** 2. 설명 화면 — 하이라이트를 누르면 옆에 설명 패널이 뜬다. initial 을 주면 처음부터 열려 있다 */
export function ParaphraseScreen({ initial = null }: { initial?: TermKey | null }) {
  const [active, setActive] = useState<TermKey | null>(initial)
  return (
    <div className="flex h-full flex-col gap-4 p-5 md:flex-row md:p-7">
      <div className="min-w-0 md:flex-1">
        <ArticleHeader />
        <ArticleBody active={active} onSelect={setActive} />
      </div>
      <div className="md:w-60 md:shrink-0">
        {active ? (
          <div key={active} className="motion-safe:animate-fade-in">
            <ExplainPanel term={active} />
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line p-4 text-center text-xs text-subtle">
            하이라이트를 누르면 여기에 설명이 떠요
          </p>
        )}
      </div>
    </div>
  )
}

/** 3. 레벨 화면 — 같은 용어(코스피)의 설명이 레벨에 따라 달라진다 */
export function LevelScreen() {
  const [level, setLevel] = useState<Level>('beginner')
  return (
    <div className="flex h-full flex-col p-5 md:p-7">
      <p className="text-xs font-semibold text-muted">내 투자 이해도</p>
      <div
        className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-bg-alt p-1"
        role="radiogroup"
        aria-label="레벨"
      >
        {LEVELS.map((item) => (
          <button
            key={item}
            type="button"
            role="radio"
            aria-checked={item === level}
            onClick={() => setLevel(item)}
            className={cn(
              'rounded-lg py-2 text-sm font-semibold transition-colors',
              item === level ? 'bg-primary-600 text-on-primary' : 'text-muted hover:text-ink',
            )}
          >
            {LEVEL_NAME[item]}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <div key={level} className="motion-safe:animate-fade-in">
          <ExplainPanel term="kospi" level={level} />
        </div>
      </div>
    </div>
  )
}

const SCRAPS = [
  '코스피, 외국인 매수세에 2650선 회복',
  '금리 동결에도 은행주는 강세, 왜?',
  '환율 1320원대 하락, 수출주 영향은',
]

const VOCAB: { word: string; level: Level }[] = [
  { word: '순매수', level: 'beginner' },
  { word: '환율', level: 'beginner' },
  { word: '코스피', level: 'intermediate' },
  { word: 'PER', level: 'intermediate' },
  { word: '베이시스', level: 'advanced' },
]

/** 4. 모음 화면 — 스크랩한 기사와 단어장 */
export function CollectScreen() {
  return (
    <div className="grid h-full gap-5 p-5 md:grid-cols-2 md:p-7">
      <div>
        <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <Icon name="scrap" className="h-4 w-4 text-primary-600" />
          스크랩
        </p>
        <ul className="mt-3 space-y-2">
          {SCRAPS.map((title) => (
            <li
              key={title}
              className="rounded-lg border border-line bg-bg px-3 py-2.5 text-[13px] font-medium text-ink"
            >
              {title}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <Icon name="vocab" className="h-4 w-4 text-primary-600" />
          단어장 <span className="font-normal text-muted">{VOCAB.length}개</span>
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {VOCAB.map((item) => (
            <li
              key={item.word}
              className="flex items-center gap-1.5 rounded-full border border-line bg-bg py-1 pl-3 pr-1.5 text-[13px] font-medium text-ink"
            >
              {item.word}
              <Badge className="px-2 py-0 text-[10px]">{LEVEL_NAME[item.level]}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
