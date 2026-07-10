/** @type {import('tailwindcss').Config} */

// 색상 값의 원본은 src/index.css 의 CSS 변수(:root = 라이트, .dark = 다크).
// rgb(var(--x) / <alpha-value>) 형태라 bg-rise/10 같은 투명도 유틸리티도 그대로 동작한다.
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 브랜드 그린 — sustainability-platform 데모 팔레트(포레스트 그린 계열)
        primary: {
          50: token('primary-50'), // badge/hover 배경 틴트
          100: token('primary-100'),
          500: token('primary-500'), // leaf
          600: token('primary-600'), // 메인 액션/브랜드 기준색 (forest green)
          700: token('primary-700'), // secondary (다크 모드에서는 틴트 배경 위 텍스트용 라이트 그린)
        },
        // 한국 증시 등락 — 브랜드 그린과 반드시 분리 (상승=빨강, 하락=파랑)
        rise: token('rise'),
        fall: token('fall'),
        // 뉴트럴/배경 — 웜 오프화이트(라이트) / 그린 블랙(다크) + 그린 잉크
        ink: token('ink'), // 본문 텍스트
        muted: token('muted'), // 보조 텍스트
        subtle: token('subtle'), // 옅은 텍스트
        line: token('line'), // 보더
        bg: token('bg'), // 앱 배경
        surface: token('surface'), // 카드/박스 배경 — 배경과 톤온톤, 한 단계 밝음
        'bg-alt': token('bg-alt'), // 대체 배경
        'bg-dark': '#1B4332', // 브랜드 다크 섹션 배경 — 양 테마 공통 고정
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
        heading: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
      },
      boxShadow: {
        // 데모 organic-card hover — 크고 부드러운 그린 섀도우
        'eco-hover': '0 20px 40px rgba(34, 139, 34, 0.10)',
        // eco-hover에서 한 단계 낮춘 버전 — 뉴스 카드 hover용 (더 작고 옅은 그린 섀도우)
        'eco-hover-soft': '0 15px 30px rgba(34, 139, 34, 0.08)',
        'eco-lift': '0 15px 30px rgba(34, 139, 34, 0.12)',
        'eco-btn': '0 10px 30px rgba(34, 139, 34, 0.30)',
      },
      backgroundImage: {
        // --gradient-nature
        'gradient-nature': 'linear-gradient(135deg, #228B22 0%, #4CAF50 100%)',
      },
      // 진입 모션 — 모달/패널/드로어가 뚝 나타나지 않게 하는 은은한 등장 애니메이션.
      // 사용처에서는 motion-safe: 접두사로 감싸 prefers-reduced-motion 사용자를 배려한다.
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // 모바일 중앙 모달용 — 최종 상태가 -translate-y-1/2(세로 중앙)라 keyframe 안에서 보정
        'modal-in': {
          from: { opacity: '0', transform: 'translateY(calc(-50% + 16px))' },
          to: { opacity: '1', transform: 'translateY(-50%)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'modal-in': 'modal-in 250ms ease-out',
        'slide-in-right': 'slide-in-right 250ms ease-out',
      },
    },
  },
  plugins: [],
}
