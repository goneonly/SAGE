import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// package.json 의 version 을 앱에 주입 — `npm version patch|minor` 로 올리면 자동 반영된다.
// (tsconfig 가 nodenext 모듈이라 JSON import 대신 fs 로 읽는다)
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8')) as {
  version: string
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
})
