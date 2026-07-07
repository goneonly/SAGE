// SAGE(Smart AI Guidance for Economics) 공용 로고 — 그라디언트 스쿼클 + "S" 모노그램.
// 슬로건: "Be a smart investor with SAGE." 워드마크는 제목 폰트(Fraunces serif)로
// 현자(sage)의 지적인 톤을 준다. favicon.svg 도 같은 마크를 쓴다.
interface LogoProps {
  /** 마크 한 변의 px 크기 (기본 36) */
  size?: number
  /** true 면 마크 옆에 "SAGE" 워드마크 표시 */
  withWordmark?: boolean
  /** 워드마크 텍스트 크기 클래스 (기본 text-lg) */
  wordmarkClassName?: string
}

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient
          id="sage-gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#228B22" />
          <stop offset="1" stopColor="#4CAF50" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#sage-gradient)" />
      <path
        d="M21.5 9.5C20.2 8 18.2 7 16 7c-3.2 0-5.5 1.7-5.5 4s2.3 3.3 5.5 4 5.5 1.7 5.5 4-2.3 4-5.5 4c-2.2 0-4.2-1-5.5-2.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Logo({ size = 36, withWordmark = true, wordmarkClassName = 'text-lg' }: LogoProps) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={size} />
      {withWordmark && (
        <span className={`font-heading font-bold tracking-tight text-ink ${wordmarkClassName}`}>
          SAGE
        </span>
      )}
    </span>
  )
}

export default Logo
