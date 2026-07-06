/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 그린 — sustainability-platform 데모 팔레트(포레스트 그린 계열)
        primary: {
          50: '#EDF7ED', // #228B22 10% 틴트 근사값 (badge/hover 배경)
          100: '#D5EDD5',
          500: '#4CAF50', // leaf
          600: '#228B22', // 메인 액션/브랜드 기준색 (forest green)
          700: '#2E7D32', // secondary
        },
        // 한국 증시 등락 — 브랜드 그린과 반드시 분리 (상승=빨강, 하락=파랑)
        rise: '#E03131',
        fall: '#1C7ED6',
        // 뉴트럴/배경 — 데모의 웜 오프화이트 + 다크 그린 잉크
        ink: '#1B4332', // 본문 텍스트 (dark green ink)
        muted: '#52796F', // 보조 텍스트
        subtle: '#84A98C', // 옅은 텍스트
        line: '#D8E2DC', // 보더
        bg: '#FAFAF5', // 앱 배경 (warm off-white)
        'bg-alt': '#F5F5E8', // 대체 배경
        'bg-dark': '#1B4332', // 다크 섹션 배경
      },
      fontFamily: {
        // 데모와 동일 — 본문 DM Sans(한글은 시스템 폰트 폴백), 제목 Fraunces serif
        sans: [
          '"DM Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Apple SD Gothic Neo"',
          '"Malgun Gothic"',
          'sans-serif',
        ],
        heading: ['Fraunces', '"Apple SD Gothic Neo"', '"Malgun Gothic"', 'serif'],
      },
      boxShadow: {
        // 데모 organic-card hover — 크고 부드러운 그린 섀도우
        'eco-hover': '0 20px 40px rgba(34, 139, 34, 0.10)',
        'eco-lift': '0 15px 30px rgba(34, 139, 34, 0.12)',
        'eco-btn': '0 10px 30px rgba(34, 139, 34, 0.30)',
      },
      backgroundImage: {
        // --gradient-nature
        'gradient-nature': 'linear-gradient(135deg, #228B22 0%, #4CAF50 100%)',
      },
    },
  },
  plugins: [],
}
