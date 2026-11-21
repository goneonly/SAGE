// 소개 페이지(/about)의 문구 — 글을 고칠 때는 이 파일만 고치면 된다.
// 앱의 동작과 맞아야 하는 숫자(레벨 3단계, 하루 목표 단어 3개 등)는 실제 코드(lib/levels, learningStore)와 같게 유지한다.
import type { IconName } from '../../components/Icon'

export const HERO = {
  eyebrow: 'SAGE — Smart AI Guidance for Economics',
  title: ['어려운 금융 뉴스,', '나에게 맞는 언어로.'],
  body: '뉴스를 읽다가 막히는 단어를 AI가 먼저 짚고, 클릭 한 번이면 내 레벨에 맞게 풀어 줘요. 읽는 것만으로 투자 공부가 돼요.',
  cta: '지금 시작하기',
  note: '아래로 내려 SAGE가 어떻게 돕는지 직접 눌러 보세요.',
}

// 브라우저 화면을 고정해 두고 한 단계씩 넘기는 기능 소개
// screen: screens.tsx 의 어떤 화면을 보여 줄지 (sections/Showcase.tsx 의 SCREENS 와 짝)
export type ShowcaseScreen = 'article' | 'paraphrase' | 'level' | 'collect'

export const SHOWCASE: {
  key: string
  label: string
  title: string[]
  body: string
  hint?: string
  screen: ShowcaseScreen
}[] = [
  {
    key: 'spot',
    label: '발견',
    title: ['읽다가 막히는 순간,', 'AI가 먼저 짚어요'],
    body: '기사 속 용어의 난이도와 문맥을 따져, 설명이 꼭 필요한 곳에만 하이라이트를 켜요.',
    screen: 'article',
  },
  {
    key: 'explain',
    label: '이해',
    title: ['클릭 한 번이면,', '그 자리에서 설명'],
    body: '하이라이트를 누르면 읽던 흐름을 끊지 않고 옆에서 바로 풀어 줘요. 이 뉴스가 투자에 어떤 의미인지도 함께요.',
    hint: '화면 속 하이라이트를 눌러 보세요.',
    screen: 'paraphrase',
  },
  {
    key: 'level',
    label: '맞춤',
    title: ['같은 용어도,', '내 레벨에 맞게'],
    body: '기초·성장·심화 — 고른 레벨에 따라 설명의 깊이가 달라져요. 레벨은 설정에서 언제든 바꿀 수 있어요.',
    hint: '화면 속 레벨을 바꿔 보세요.',
    screen: 'level',
  },
  {
    key: 'collect',
    label: '축적',
    title: ['배운 건,', '내 것으로 쌓이게'],
    body: '중요한 기사는 스크랩, 새로 배운 용어는 단어장에. 흩어진 배움이 한곳에 모여요.',
    screen: 'collect',
  },
]

export const NUMBERS = {
  title: ['읽기만 해도', '공부가 되도록'],
  items: [
    { value: 3, unit: '단계', label: '기초 · 성장 · 심화 레벨' },
    { value: 1, unit: '번', label: '클릭이면 그 자리에서 설명' },
    { value: 3, unit: '개', label: '하루 목표 단어 — 기사 1개와 함께' },
  ],
}

export const COMPARE = {
  title: ['원문과 SAGE,', '나란히 비교'],
  body: '같은 문장이 기초 레벨에서 어떻게 풀리는지 보세요. 가운데 선을 좌우로 끌면 비교할 수 있어요.',
  left: '원문',
  right: 'SAGE 기초 설명',
  original:
    '외국인 순매수 전환과 원·달러 환율 하락이 맞물리며 코스피가 시가총액 상위 반도체주 중심으로 2,650선을 회복했다.',
  paraphrased:
    '외국인 투자자들이 한국 주식을 판 것보다 더 많이 사기 시작했어요. 원화 값이 오르자 한국 주식이 더 매력적으로 보였고, 덩치 큰 반도체 회사 주가가 오르면서 시장 전체 점수(코스피)도 2,650까지 올라왔어요.',
}

// icon: components/Icon.tsx 의 채움형 아이콘 이름
export const FEATURES: {
  title: string[]
  items: { icon: IconName; title: string; body: string }[]
} = {
  title: ['매일 읽는 습관을', '돕는 작은 장치들'],
  items: [
    {
      icon: 'news',
      title: '맞춤 추천 뉴스',
      body: '관심 종목과 관련된 뉴스를 골라 신문 1면처럼 넘겨 보여 줘요.',
    },
    {
      icon: 'trending',
      title: '급상승 종목',
      body: '지금 크게 오르내리는 종목을 모아 보고, 관련 뉴스로 바로 이어져요.',
    },
    {
      icon: 'insights',
      title: 'AI 투자 인사이트',
      body: '오늘의 시장 흐름을 AI가 짧은 코멘트로 정리해 줘요.',
    },
    {
      icon: 'vocab',
      title: '나만의 단어장',
      body: '설명을 본 용어를 모아 두고, 레벨별 설명으로 다시 복습해요.',
    },
    {
      icon: 'scrap',
      title: '스크랩',
      body: '다시 읽고 싶은 기사를 한곳에 모아 둬요.',
    },
    {
      icon: 'lightbulb',
      title: '레벨업 제안',
      body: '꾸준히 읽다 보면 다음 레벨로 올라갈 때를 알려 줘요.',
    },
  ],
}

export const CTA = {
  title: ['Be A Smart Investor', 'with SAGE!'],
  body: 'SAGE의 설명과 인사이트는 AI가 생성해요. 투자 결정은 반드시 본인의 판단과 책임하에 진행해 주세요.',
  cta: '지금 시작하기',
}
