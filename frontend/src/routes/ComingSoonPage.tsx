// 아직 구현되지 않은 사이드바 메뉴용 공용 스텁 (뉴스/스크랩/단어장/급상승 종목/포트폴리오/AI 투자 인사이트/설정).
// 각 화면은 이후 Phase 에서 features/* 로 교체된다.
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-2 text-center">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="text-sm text-muted">Coming soon — 준비 중입니다.</p>
    </div>
  )
}

export default ComingSoonPage
