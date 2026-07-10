import { cn } from '../../lib/cn'

// 로딩 스켈레톤 — 텍스트 자리 표시용 펄스 블록. 폭·높이는 className 으로 지정한다.
// 장식 요소이므로 스크린리더에는 숨긴다(로딩 상태 고지는 컨테이너의 aria-busy 몫).
function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded bg-line/70', className)} />
}

export default Skeleton
