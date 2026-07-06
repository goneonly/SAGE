// 알림창 테스트용 더미 데이터. 백엔드 붙기 전까지 NotificationBell 이 이 목록을
// 초기 상태로 사용한다(읽음 처리 등은 컴포넌트 로컬 상태에서 이뤄진다).
// TODO(backend): GET /api/notifications 응답으로 교체.
export interface AppNotification {
  id: string
  title: string
  body: string
  time: string
  read: boolean
}

export const seedNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: '관심 종목 급등',
    body: '삼성전자가 오늘 +3.1% 상승했음. 지금 확인해보기.',
    time: '방금 전',
    read: false,
  },
  {
    id: 'n2',
    title: '새 뉴스 추천',
    body: '내 레벨에 맞춘 오늘의 코스피 브리핑이 도착했음.',
    time: '12분 전',
    read: false,
  },
  {
    id: 'n3',
    title: '저장한 단어 복습',
    body: '어제 저장한 단어 3개를 복습할 시간임.',
    time: '1시간 전',
    read: false,
  },
  {
    id: 'n4',
    title: '스크랩한 기사 업데이트',
    body: '스크랩한 "2차전지 업황 반등" 기사에 후속 보도가 나왔음.',
    time: '3시간 전',
    read: true,
  },
  {
    id: 'n5',
    title: '주간 포트폴리오 요약',
    body: '이번 주 내 관심 종목 수익률 요약이 준비됐음.',
    time: '어제',
    read: true,
  },
]
