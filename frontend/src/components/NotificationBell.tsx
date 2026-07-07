import { useEffect, useRef, useState } from 'react'
import { seedNotifications } from '../features/notifications/seedNotifications'

// 오른쪽 상단 알림 벨 + 드롭다운. 백엔드가 없어 seed 더미 데이터로 초기화하고,
// 읽음 처리는 로컬 상태에서 즉시 반영해 실제 동작을 테스트할 수 있게 한다.
function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(seedNotifications)
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = items.filter((item) => !item.read).length

  // 드롭다운이 열려 있을 때 바깥을 클릭하면 닫는다.
  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  function markAllRead() {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  function toggleRead(id: string) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)))
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={unreadCount > 0 ? `알림 ${unreadCount}개` : '알림'}
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-muted hover:bg-primary-50 hover:text-ink"
      >
        {/* 벨 아이콘 — 이모지 대신 SVG(플랫폼별 렌더링 편차 방지, 색상 제어 가능) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rise px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="text-sm font-semibold text-ink">알림</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-primary-600 hover:underline"
              >
                모두 읽음
              </button>
            )}
          </div>

          <ul className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted">새 알림이 없음</li>
            ) : (
              items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggleRead(item.id)}
                    className={`flex w-full flex-col items-start gap-1 border-b border-line px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-primary-50 ${
                      item.read ? '' : 'bg-primary-50/50'
                    }`}
                  >
                    <div className="flex w-full items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          item.read ? 'bg-transparent' : 'bg-primary-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-ink">{item.title}</span>
                      <span className="ml-auto shrink-0 text-[11px] text-muted">{item.time}</span>
                    </div>
                    <span className="pl-4 text-xs text-muted">{item.body}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
