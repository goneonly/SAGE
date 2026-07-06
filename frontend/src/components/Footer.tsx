// 하단 푸터 — sustainability-platform 데모 푸터 구조를 따름:
// 브랜드 컬럼(로고+설명) + 연결 항목(회사/LinkedIn/GitHub) + 구분선 + copyright.
// TODO: 아직 실제 바로가기 없음 — 지금은 텍스트로만 두고, 주소가 정해지면 <a>로 교체.
const FOOTER_LINKS = ['회사', 'LinkedIn', 'GitHub']

function Footer() {
  return (
    <footer className="border-t border-line bg-bg py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-nature text-lg font-bold text-white">
                U
              </div>
              <span className="text-xl font-bold text-ink">UFN</span>
            </div>
            <p className="text-sm text-muted">
              내 수준에 맞춘 금융 뉴스 — 어려운 용어는 클릭 한 번으로 쉽게.
            </p>
          </div>

          <ul className="flex items-center gap-6">
            {FOOTER_LINKS.map((label) => (
              <li key={label}>
                {/* 바로가기 미정 — 텍스트로만 표시 */}
                <span className="cursor-default text-sm text-muted transition-colors hover:text-primary-600">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line pt-6">
          <p className="text-sm text-muted">© 2026 UFN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
