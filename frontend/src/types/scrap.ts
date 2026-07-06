// PLAN.md §7 user_scraps(id, user_id, article_id, created_at) — user_id는 클라이언트에
// 로그인 사용자가 한 명뿐이라 생략. 스크랩 카드 렌더링에 필요한 필드(title/source/publishedAt)는
// seed 데이터를 매번 다시 찾지 않도록 저장 시점에 함께 스냅샷으로 담아둔다.
export interface ScrapEntry {
  id: string
  articleId: string
  title: string
  source: string
  publishedAt: string
  createdAt: string
}
