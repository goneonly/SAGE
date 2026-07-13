/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  /** 운영자 이메일 목록(쉼표 구분). 비어 있으면 admin 계정 없음. */
  readonly VITE_ADMIN_EMAILS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// vite.config.ts 의 define 으로 주입되는 전역 — package.json 의 version 값.
declare const __APP_VERSION__: string
