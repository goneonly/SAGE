/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 그린 (PLAN.md §6)
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669', // 메인 액션/브랜드 기준색
          700: '#047857',
        },
        // 한국 증시 등락 — 브랜드 그린과 반드시 분리 (상승=빨강, 하락=파랑)
        rise: '#E03131',
        fall: '#1C7ED6',
        // 뉴트럴/배경
        ink: '#0F172A', // 본문 텍스트
        muted: '#64748B',
        line: '#E2E8F0', // 보더
        bg: '#F8FAFC', // 앱 배경
      },
    },
  },
  plugins: [],
}
