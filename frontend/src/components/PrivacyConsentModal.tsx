// 개인정보 수집·이용 동의 전문 모달 — 회원가입 화면의 "자세히 보기"에서 연다.
// 백드롭 클릭 또는 닫기 버튼으로 닫는다.
interface PrivacyConsentModalProps {
  onClose: () => void
}

function PrivacyConsentModal({ onClose }: PrivacyConsentModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="개인정보 수집 및 이용 동의"
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-line bg-surface p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-base font-bold text-ink">개인정보 수집 및 이용 동의 (필수)</h3>
        <div className="mt-3 space-y-3 text-sm text-ink">
          <p>
            SAGE는 회원가입 및 금융 뉴스 학습 서비스를 제공하기 위해 아래와 같이 개인정보를
            수집·이용합니다.
          </p>
          <div>
            <p className="font-semibold">수집 항목</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted">
              <li>이름, 이메일, 전화번호</li>
              <li>비밀번호(암호화 저장)</li>
              <li>나이(선택 입력)</li>
              <li>투자 이해도 및 학습 기록(단어장·스크랩 등)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">이용 목적</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted">
              <li>회원 식별 및 로그인</li>
              <li>이해도 수준에 맞는 용어 설명 제공</li>
              <li>학습 기록 저장 및 조회</li>
              <li>서비스 운영 및 오류 대응</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">보관 기간</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted">
              <li>
                회원 탈퇴 시까지 보관하며, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안
                보관합니다.
              </li>
            </ul>
          </div>
          <p className="text-muted">
            이용자는 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으나, 동의하지 않을 경우
            회원가입이 제한됩니다.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border-2 border-primary-600 py-2 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-600 hover:text-white"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default PrivacyConsentModal
