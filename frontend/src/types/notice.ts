// 공지사항 도메인 타입 — 운영자가 등록·수정·삭제하고, 공개 /notices 페이지에서 노출된다.
export interface Notice {
  id: string
  title: string
  body: string
  /** 표시용 날짜 (YYYY-MM-DD) */
  date: string
  /** 정렬용 생성 시각 (ISO) */
  createdAt: string
}
