# 붕어빵 타이쿤 — 앱 소스 (app-source 브랜치)
- `web/` 게임 본체(HTML/JS, 웹 테스트·앱 공통)
- `app/` Capacitor 앱(Android/iOS). `npm run sync`가 `web/`을 `www/`로 복사 후 동기화 (경로: `../web`로 수정 필요 시 package.json 확인)
- `server/` Firebase Cloud Function(랭킹 추월 푸시), `deploy.sh`로 배포
- 제외됨: `google-services.json`(Firebase 콘솔에서 받아 `app/android/app/`에 배치), 키스토어, node_modules
