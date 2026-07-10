// Tailwind 클래스 조합 헬퍼 — 조건부 클래스를 falsy 필터링 후 공백으로 잇는다.
// clsx/tailwind-merge 도입 전의 최소 구현: 지금 규모에선 충돌 병합까지는 필요 없다.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
