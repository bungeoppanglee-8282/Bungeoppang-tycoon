# 붕어빵 타이쿤 — 스토어 출시 체크리스트

개발자가 아니어도 위에서부터 순서대로 따라 하면 되도록 썼습니다. ☐ 표시는 사장님(주희 님)이 직접 하셔야 하는 일입니다.

---

## 0. 비용과 계정 (2026-11-09에 확인)

| 스토어 | 비용 | 출처 (확인일) |
|---|---|---|
| Apple App Store | **연 99 USD** (현지 통화로 낼 수도 있음, 매년 갱신) | [Apple Developer – Membership Details](https://developer.apple.com/programs/whats-included/) (2026-11-09) |
| Google Play | **25 USD, 한 번만** | [Play Console 고객센터 – 개발자 계정 등록](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en) (2026-11-09) |

- ☐ **Apple**: <https://developer.apple.com/programs/enroll/> 에서 개인(Individual)으로 가입합니다. Apple ID에 2단계 인증이 켜져 있어야 하고, 승인까지 보통 1~2일 걸립니다.
- ☐ **Google**: <https://play.google.com/console> 에서 개인 계정을 만듭니다. 신분증 인증이 필요합니다.
- ⚠️ **Google 개인 계정의 테스트 의무**: 2023-11-13 이후 만든 개인 계정은 정식 출시 전에 **테스터 12명 이상이 14일 연속으로 참여한 비공개 테스트**를 마쳐야 합니다 ([Play 고객센터 – 개인 계정 앱 테스트 요건](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en), 2026-11-09 확인). 지인 12명의 Gmail 주소를 미리 모아 두세요. 이 단계 때문에 Android 출시에는 최소 2주 이상이 더 걸립니다.

---

## 1. 출시 전에 꼭 정해야 할 것

- ☐ **앱 ID 바꾸기**: 앱 ID는 `com.ljh.bungeoppang`으로 확정했고 3곳(아래 1~2번, iOS)에 이미 적용했습니다. **스토어에 한 번 올리면 영원히 바꿀 수 없으니 바꾸지 마세요.** (아래는 만약 바꿀 때만 참고)
  바꿀 파일:
  1. `app/capacitor.config.json`의 `appId`
  2. `app/android/app/build.gradle`의 `namespace`와 `applicationId`
  3. Android Studio에서 `MainActivity.java`의 패키지 이름을 새 이름으로 바꾸기 (Refactor → Rename)
  4. Xcode → App 타깃 → Signing & Capabilities → Bundle Identifier

  가장 쉬운 방법은 `app/android`와 `app/ios` 폴더를 지우고, 1번을 고친 다음 `npx cap add android`와 `npx cap add ios`를 다시 실행하는 것입니다. 이때 세로 고정과 아이폰 전용 설정이 지워지므로 아래 "현재 설정"을 다시 적용해야 합니다.
- ☐ **개인정보처리방침 URL** (아래 5장)
- ☐ **지원(문의) 이메일 또는 URL**: 두 스토어 모두 필수입니다.

**현재 들어 있는 설정**
- 세로 화면 고정 (Android `AndroidManifest.xml`, iOS `Info.plist`)
- iOS는 **아이폰 전용**(`TARGETED_DEVICE_FAMILY = 1`)입니다. 그래서 아이패드 스크린샷이 필요 없습니다. 아이패드도 지원하려면 Xcode에서 iPad를 체크하고 13인치 스크린샷을 추가하세요.
- `ITSAppUsesNonExemptEncryption = false`: 암호화 관련 수출 규정 질문이 자동으로 "아니오"로 처리됩니다.
- 버전은 1.0이고 빌드 번호는 1입니다. 업데이트를 올릴 때마다 빌드 번호를 1씩 올려야 합니다 (Android `versionCode`, iOS Build).

---

## 2. 게임을 앱에 넣기 (매번 하는 일)

게임 원본은 `web/` 폴더에 있습니다. 앱은 이 폴더를 `app/www`로 복사해서 씁니다.

```bash
cd app
npm install          # 처음 한 번만
npm run sync         # web → www 복사(BRIEF.md 제외) + 안드로이드/iOS 프로젝트에 반영
```
- 아이콘이나 스플래시를 바꿨다면: `python3 resources/make_store_art.py` → `npm run assets` → `npm run sync`
- **게임을 고칠 때마다 `npm run sync`를 실행한 다음 빌드하세요.** 실행하지 않으면 예전 게임이 그대로 들어갑니다.

---

## 3. Android 빌드 (Windows나 Mac + Android Studio)

이 작업 환경에는 Android SDK가 없어서 APK와 AAB를 직접 만들지 못했습니다. 프로젝트(`app/android`)와 아이콘·스플래시는 모두 준비되어 있습니다.

1. ☐ [Android Studio](https://developer.android.com/studio)를 설치합니다 (SDK가 함께 설치됩니다).
2. ☐ `cd app && npm install && npm run android`를 실행하면 Android Studio가 열립니다. 처음에는 Gradle 동기화에 몇 분 걸립니다.
3. ☐ 휴대폰을 USB로 연결하고(개발자 옵션 → USB 디버깅 켜기) ▶ Run을 눌러 직접 플레이해 봅니다. 확인할 것: 뒤로가기 버튼, 홈으로 나갔다 돌아왔을 때 일시정지와 이어하기, 소리.
4. ☐ 메뉴 **Build → Generate Signed App Bundle / APK → Android App Bundle**을 고르고 **Create new keystore**를 누릅니다.
   - ⚠️ **키스토어 파일(.jks)과 비밀번호는 절대 잃어버리면 안 됩니다.** 클라우드와 USB 두 곳 이상에 보관하세요. (Play 앱 서명을 쓰면 업로드 키를 잃어버렸을 때 재설정할 수 있지만 절차가 번거롭습니다.)
5. ☐ `app-release.aab` 파일이 만들어집니다.
6. ☐ Play Console → 앱 만들기 → **테스트 → 비공개 테스트**에 .aab를 올리고 테스터 12명을 초대한 뒤 **14일**을 기다립니다.
7. ☐ 그동안 스토어 등록정보, 콘텐츠 등급, 데이터 보안(5장 답안), **타깃 연령 = 13세 이상**(13세 미만 선택 금지), **광고 포함 = 예**, 인앱 상품(3-1장)을 채웁니다.
8. ☐ 14일이 지나면 **프로덕션 액세스 신청** → 심사 → 출시.

### 3-1. 인앱 상품 등록 (Play Console, 진짜 결제용)

앱에는 Google Play 결제가 연결되어 있습니다(`BillingPlugin.kt`, `web/js/iap.js`). **아래 상품 4개를 콘솔에 먼저 만들어야** 구글 플레이 앱에서 결제가 됩니다. 상품이 없거나 ID가 다르면 결제 단계에서 "결제하지 못했어요"가 뜹니다(상점에서 숨기지는 않습니다).

- ☐ Play Console → **수익 창출 → 제품 → 인앱 상품 → 인앱 상품 만들기**. 유형은 일회성 구매입니다. 제품 ID는 아래 표와 **한 글자도 다르지 않게** 입력하세요.
- ☐ 상품을 만들 때 **활성**으로 바꾸고, 가격은 대한민국 기준으로 입력합니다(다른 나라는 자동 환산 가능).
- ☐ 판매자 프로필(세금·은행 정보)이 필요합니다. 없으면 결제가 열리지 않습니다.
- ☐ 테스트: Play Console → 설정 → **라이선스 테스트**에 내 구글 계정을 등록하면 실제로 돈이 나가지 않고 결제를 시험할 수 있습니다. 서명한 앱 번들을 **비공개 테스트 트랙**에 올린 뒤, 그 트랙에서 설치한 앱으로만 결제 시험이 됩니다(USB로 설치한 디버그 앱은 안 됩니다).

| 제품 ID | 이름 | 권장 가격 | 종류 |
|---|---|---|---|
| `gem50` | 다이아 50개 | ₩4,900 | **소모성(여러 번 구매)** |
| `gem100` | 다이아 100개 | ₩8,900 | **소모성** |
| `gem200` | 다이아 200개 | ₩17,500 | **소모성** |
| `gem300` | 다이아 300개 | ₩24,500 | **소모성** |

- 현금으로 파는 것은 **다이아뿐**입니다(정가 1💎 = ₩100. 묶음 할인: 50개 2%, 100개 11%, 200개 12.5%, 300개 18%). 부스터와 특별 아이템은 다이아로 삽니다. 가격(다이아 개수)은 `web/js/data.js`의 `GEM_COST`, `PERKS`에서 바꿉니다. 원화 가격은 콘솔에서만 바꾸면 됩니다.
- 앱 안에서 쓰는 다이아 가격: 미니붕어빵 20개 팩 20💎 · 얼음 3개 팩 30💎 · 틀 추가 30💎 · 인내심 연장 40💎 · 즉시 굽기 20개 팩 40💎 · 출석 선물 팩 50💎 · 광고 제거 50💎.
- 앱 안의 가격 표시는 콘솔에 입력한 가격이 자동으로 쓰입니다(나라별 통화 포함).
- 결제가 끝났는데 게임에 지급되지 않은 경우(앱이 꺼졌을 때 등)는 다음에 앱을 켤 때 자동으로 지급됩니다. 다이아와 구매한 아이템은 기기에 저장됩니다. 앱을 지우거나 기기를 바꾸면 사라지며(서버 저장 없음), 소모성 상품이라 Play의 구매 복원도 되지 않습니다.
- 한계: 서버에서 영수증을 다시 확인하지 않습니다. 루팅된 기기에서 결제를 속이는 것은 막지 못합니다. 문제가 생기면 Cloud Function으로 구매 토큰 검증을 추가하세요.

---

### 3-2. 웹 버전 결제 (토스페이먼츠: 네이버페이 · 휴대폰 결제)

웹 버전(브라우저)에서 다이아를 사는 결제입니다. 코드는 `web/js/webpay.js`(화면), `server/functions/pay.js`·`index.js`(서버)에 있습니다. **구글 플레이 앱 안에서는 쓰지 않습니다**(Play 정책상 Play 결제만). 아래 준비가 끝나기 전까지 웹 버전의 다이아 팩은 보이되 누르면 "결제 준비 중"이 뜹니다.

- ☐ [토스페이먼츠](https://www.tosspayments.com) 가맹점 가입과 심사. **네이버페이(간편결제)**와 **휴대폰 결제**를 사용하도록 계약합니다. 휴대폰 결제는 별도 심사와 월 한도가 있을 수 있으니 고객센터에 먼저 문의하세요. 디지털 상품(다이아)을 파는 상점이라고 정확히 알려야 합니다.
- ☐ 개발자센터에서 키 2개를 받습니다: **결제위젯(주문서형) 클라이언트 키**(`test_gck_…`, 라이브는 `live_gck_…`)와 **시크릿 키**(`test_gsk_…`).
- ☐ 클라이언트 키는 공개되어도 되는 값입니다. `web/js/webpay.js`의 `PAY.clientKey`에 넣으면 결제가 열립니다. 시크릿 키는 **절대 저장소·채팅에 적지 않습니다.**
- ☐ 시크릿 키는 Cloud Shell에서 `firebase functions:secrets:set TOSS_SECRET_KEY --project my-bungeoppang-tycoon`로 넣습니다(붙여넣기 창에 입력).
- ☐ 서버 배포: `python3 server/build_deploy.py`로 `deploy.sh`를 새로 만든 뒤 내용을 Cloud Shell에 붙여넣고 실행합니다(기존 알림 함수와 함께 배포됩니다).
- ☐ 토스페이먼츠 콘솔에서 결제수단 노출 순서를 **네이버페이가 맨 위**가 되게 정하고, 먼저 **테스트 키**로 결제를 시험합니다.
- 가격과 다이아 개수는 서버(`pay.js`의 `PACKS`)가 정합니다. 앱의 `GEM_PACKS`와 같아야 하며 `node tests/pay.test.js`가 확인합니다.
- 한계: 환불·결제 취소는 토스페이먼츠 콘솔에서 합니다. 취소해도 이미 지급된 다이아는 자동으로 회수되지 않습니다.

---

### 3-3. 다이아 서버 지갑 (Firebase) 배포

다이아 잔액과 구매·사용 내역은 서버(Firebase, 서울)가 보관합니다. 코드는 `server/functions/wallet.js`입니다. 앱은 서버가 알려준 잔액을 화면에 보여줄 뿐이고, 사용(차감)도 서버가 합니다. 같은 요청을 다시 보내도 두 번 처리되지 않습니다.

- ☐ `python3 server/build_deploy.py`로 `deploy.sh`를 새로 만들어 Cloud Shell에 붙여넣고 배포합니다(함수 `walletGet`, `walletSpend`, `walletPlay`, `walletLog`가 추가됩니다. 데이터는 `wallets/`, `purchases/`에 저장되며 별도 Firestore 규칙 변경은 필요 없습니다. 클라이언트는 직접 읽거나 쓰지 못합니다).
- ☐ **구글 플레이 결제 확인용 연결**: Google Cloud 콘솔에서 `Google Play Android Developer API`를 켜고, Play Console → 설정 → **API 액세스**에서 프로젝트 `my-bungeoppang-tycoon`을 연결한 뒤, 함수가 쓰는 서비스 계정에 **재무 데이터 보기** 권한을 줍니다. (권한 이름과 위치는 콘솔 화면에서 확인하세요. 연결 전에는 구글 플레이 결제가 서버에서 거절되어 다이아가 들어오지 않고, 구매는 소모되지 않은 채 남아 있다가 연결 후 다음 실행 때 자동 지급됩니다.)
- ☐ 라이선스 테스트 계정으로 결제 → 잔액 → 사용 → 내역(📜 버튼)을 확인합니다.
- ⚠️ **앱을 지우면 새 익명 계정이 만들어져 잔액을 찾지 못합니다.** 계정 복원은 로그인(구글·카카오·네이버)을 서버 계정과 연결할 때 가능합니다(로그인 연동 때 함께 진행).
- 환불·정정 문의가 오면 Firebase 콘솔 → Firestore → `wallets/{익명 ID}/ledger`에서 내역을 확인합니다.

### 3-4. 토스 앱(앱인토스) 버전 결제

토스 앱 안에서 다이아를 사는 결제입니다. 구글 플레이 앱과 웹 버전과 **별개**이며, 토스 앱 빌드(`web/js/build.js`의 `BUILD='toss'`)에서만 켜집니다. 코드는 `web/js/tossiap.js`(앱), `server/functions/tossiap.js`(서버), `toss/sdk-bridge.js`(토스 SDK 연결)입니다. 준비가 끝나기 전까지 팩은 그대로 보이고 누르면 "다이아 결제를 준비 중이에요"가 뜹니다.

**흐름 (토스 공식 문서 기준)**
```
팩 누름 → 토스 결제창 → 결제 완료 → (앱이 바로 "접수" 응답)
→ 우리 서버가 토스 서버에 "이 주문 진짜 결제됐나? 이 사람이 산 게 맞나?" 확인
→ 맞으면 다이아를 지갑에 1번만 넣음
```
- 가격·개수는 서버(`catalog.js`)가 정하고, 어떤 상품인지는 토스가 알려준 값만 믿습니다.
- 앱이 꺼지거나 인터넷이 끊겨도 다음 실행 때 미지급 주문을 찾아 자동 지급합니다(같은 주문은 두 번 들어가지 않음).
- **계정**: 토스가 주는 익명 사용자 식별키(동의 화면 없음, 이름·전화번호 안 받음)로 지갑을 연결합니다. 그래서 **앱을 지우거나 폰을 바꿔도 같은 토스 계정이면 다이아가 복원**됩니다. 토스 앱 빌드는 익명 계정을 만들지 않습니다.

**사용자가 직접 할 일 (순서대로)**
- ☐ 1. [앱인토스 개발자센터](https://developers-apps-in-toss.toss.im) 가입 → 워크스페이스와 미니앱 등록. 미니앱 이름(`appName`)은 콘솔에 등록한 것과 **똑같이** 써야 업로드됩니다.
- ☐ 2. **사업자 정보 등록**(인앱 결제의 필수 첫 단계) → **정산 정보 입력 후 검토 요청**(영업일 2~3일). 사업자 등록이 없으면 인앱 결제를 연동할 수 없다고 공식 문서에 적혀 있으니, 먼저 가능한 방법을 콘솔 안내에서 확인하세요.
- ☐ 3. **인앱 상품 4개 등록** (유형 **소모품**, 이미지 1024×1024). 콘솔에는 **공급가(부가세 제외, 10원 단위)**를 넣고 판매가는 자동 계산됩니다. 그래서 4,900원처럼 딱 떨어지게는 안 되고 아래처럼 가장 가까운 값이 됩니다.

| 상품 | 공급가 입력 | 판매가(공급가×1.1) | 개수 |
|---|---|---|---|
| 다이아 50개 | 4,450원 | 4,895원 | 50 |
| 다이아 100개 | 8,090원 | 8,899원 | 100 |
| 다이아 200개 | 15,910원 | 17,501원 | 200 |
| 다이아 300개 | 22,270원 | 24,497원 | 300 |

  - 수수료는 앱마켓 15% + 토스 5%입니다(공식 문서, 향후 변동 가능). 가격을 바꿀지는 사용자가 정하세요.
  - 상품명은 실제 내용과 같아야 합니다(예: "다이아 50개"). 현금성·환가성 상품, 토스 포인트와 결합한 상품은 판매할 수 없습니다(다이아는 게임 안에서만 쓰는 소모품입니다).
  - 등록 후 각 상품의 **상품 ID(sku)**를 알려 주세요. 제가 `web/js/tossiap.js`와 `server/functions/catalog.js`의 `TOSS_SKU` 두 곳에 같이 넣습니다(`node tests/toss.test.js`가 두 곳이 같은지 확인). 콘솔에서 ID를 직접 정할 수 있고 `gem50`, `gem100`, `gem200`, `gem300`으로 정했다면 비워 둬도 서버는 동작하지만, 앱 쪽 `TOSS_SKU`는 채워야 팩이 열립니다.
- ☐ 4. **mTLS 인증서 발급**: 콘솔 → 미니앱 → **개발 → mTLS 인증서 → + 발급받기**(이름은 영문·숫자만). 내려받은 zip의 `*_public.crt`와 `*_private.key`가 서버가 토스와 통신하는 열쇠입니다. **개인 키는 저장소·채팅에 올리지 마세요.** 만료일 전에 새로 발급해 교체합니다.
- ☐ 5. Cloud Shell에서 열쇠를 서버에 등록(파일은 Cloud Shell 편집기로 올린 뒤 경로를 씁니다):
  ```
  firebase functions:secrets:set TOSS_MTLS_CERT --data-file=<경로>/..._public.crt --project my-bungeoppang-tycoon
  firebase functions:secrets:set TOSS_MTLS_KEY  --data-file=<경로>/..._private.key --project my-bungeoppang-tycoon
  ```
- ☐ 6. **로그인용 권한 1회 설정**: Google Cloud 콘솔 → IAM → 함수가 쓰는 서비스 계정(보통 `…-compute@developer.gserviceaccount.com`)에 **서비스 계정 토큰 생성자(Service Account Token Creator)** 역할 추가. 이게 없으면 토스 로그인에서 "토큰을 만들 수 없음" 오류가 납니다(권한 이름과 위치는 콘솔 화면에서 확인하세요).
- ☐ 7. `python3 server/build_deploy.py`로 `deploy.sh`를 새로 만들어 Cloud Shell에 붙여넣고 배포합니다(함수 `tossLogin`, `tossGrant`가 추가됩니다. 3-2, 3-3장 배포와 한 번에 해도 됩니다).
- ☐ 8. 미니앱 번들에 토스 SDK 연결: 토스 앱 프로젝트에서 `npm install @apps-in-toss/web-framework`(**3.6.0 이상**, 익명 키 인증 코드 때문), `toss/sdk-bridge.js`를 번들에 넣고 `index.html`에 `<script type="module" src="sdk-bridge.js"></script>`를 게임 스크립트 뒤에 추가합니다. 서버 CORS는 `https://<appName>.apps.tossmini.com`과 `https://<appName>.private-apps.tossmini.com`을 허용해야 하는데, **Firebase 함수는 이미 모든 출처를 허용(`cors:true`)**하므로 따로 할 일은 없습니다.
- ☐ 9. **테스트**: SDK 3.x는 샌드박스가 없습니다. 로컬 브라우저 devtools의 mock으로 흐름을 본 뒤, 콘솔 QR(`intoss-private`)로 토스 앱에서 시험합니다. **QR 시험은 모의 결제가 아니라 실제 결제입니다.** 꼭 해 볼 것: ① 결제 성공 ② 결제 성공 + 서버 실패(인터넷 끊고 결제 → 다시 켜면 지급) ③ 결제 취소 ④ 폰 바꾸기/재설치 후 잔액 복원.
- ☐ 10. 출시 심사: 게임 출시 가이드의 **인앱 결제** 항목(결제 중 음악 일시정지, 결제창 금액과 주문 금액 일치, 취소 시 주문 화면 복귀, 결제 내역 확인 가능, **기기를 바꿔도 구매 데이터 유지**)과 **사용자 식별키로 데이터 유지** 항목을 확인합니다. 결제창이 열려 있는 동안 음악은 멈추고 끝나면 다시 나옵니다(`BGM.hold`). 실제 토스 앱에서는 사용자가 직접 확인해 주세요.

**환불·한계**
- 환불은 사용자가 토스 앱에서 신청하고, 사업자가 콘솔 **환불 내역**에서 승인·반려합니다(최종 결정은 마켓). 토스는 결제·환불을 알려주는 웹훅이 없어서, **환불돼도 이미 들어간 다이아는 자동으로 회수되지 않습니다**(Google Play와 같은 한계). 환불 요청이 오면 승인 전에 Firestore `wallets/{ID}/ledger`로 다이아를 이미 썼는지 확인하세요. 자동 회수가 필요하면 말씀해 주세요.
- 앱 내부 테스트용 `TOSS_SKU`가 비어 있으면 팩은 보이되 "준비 중"입니다(숨기지 않음).
- 개인정보처리방침·삭제 안내에 토스 익명 사용자 식별키 항목을 추가했습니다(이 브랜치). **`main` 반영은 승인 후에만** 합니다.

---

## 4. iOS 빌드 (Mac + Xcode가 꼭 필요)

이 환경은 리눅스라서 iOS 빌드를 할 수 없습니다. `app/ios` 프로젝트는 만들어 두었습니다.

1. ☐ Mac App Store에서 **Xcode**를 설치합니다 (무료, 큰 용량).
2. ☐ `cd app && npm install && npm run ios`를 실행하면 Xcode가 열립니다. 이 Capacitor 버전은 CocoaPods 대신 Swift Package Manager를 쓰므로 따로 설치할 것이 없습니다.
3. ☐ Xcode → Settings → Accounts에서 Apple ID로 로그인합니다.
4. ☐ 왼쪽에서 **App** 타깃을 고르고 **Signing & Capabilities**에서 Team을 내 계정으로 정하고, Bundle Identifier를 1장에서 정한 ID로 바꿉니다.
5. ☐ 아이폰을 연결하고 ▶를 눌러 실제 기기에서 테스트합니다.
6. ☐ [App Store Connect](https://appstoreconnect.apple.com) → 나의 앱 → **+ 신규 앱** (번들 ID 선택, SKU는 아무 문자열이나 가능).
7. ☐ Xcode 상단의 기기를 **Any iOS Device (arm64)**로 바꾸고 **Product → Archive** → Distribute App → App Store Connect → Upload.
8. ☐ 10~30분 뒤 App Store Connect의 **TestFlight**에 빌드가 나타나면 내 폰으로 한 번 더 확인합니다.
9. ☐ 앱 정보, 스크린샷, 개인정보 "영양 성분표", 연령 등급을 채우고 **심사에 제출**합니다 (보통 1~3일).

---

## 5. 개인정보처리방침과 데이터 보안 양식

앱이 지금 다루는 정보 (코드 기준, 2026-11-21):

| 정보 | 언제 | 어디로 |
|---|---|---|
| 게임 진행 데이터 | 항상 | 기기 안에만 |
| 가게 이름, 누적 판매 개수·수익, 익명 ID | **랭킹 참여를 허용한 경우만** | Google Firebase(서울) |
| 푸시 토큰, 언어 | 랭킹 참여 + 랭킹 알림 ON인 경우만 | Google Firebase |
| 광고 ID, 기기·앱 정보 | 광고가 나올 때 | Google AdMob |
| 구매 내역 | 유료 상품을 살 때 | Google Play가 처리(앱은 카드 정보를 받지 않음) |
| 토스 익명 사용자 식별키, 토스 주문번호 | **토스 앱 버전에서 다이아를 쓰거나 살 때만** | Google Firebase(서울). 토스 앱 버전은 Play 앱이 아니므로 Play 데이터 보안 양식에는 영향 없음 |

- **개인정보처리방침 URL**: `https://bungeoppanglee-8282.github.io/Bungeoppang-tycoon/` (저장소 `main`의 `index.html`). 앱이 바뀌면 이 페이지도 같이 고칩니다. 두 스토어 모두 URL이 필수입니다.
- 외부 글꼴(Google Fonts) 호출은 제거했습니다. 이제 글꼴 때문에 IP가 Google로 가지 않고 오프라인에서도 같은 글꼴이 나옵니다.
- **Play 데이터 보안 양식 답안 (제 판단입니다. 콘솔에서 직접 확인하세요)**
  - 수집: 기기 또는 기타 ID(광고 ID, 푸시 토큰, 익명 사용자 ID)
  - 수집: 사용자 생성 콘텐츠(가게 이름과 랭킹 점수, 랭킹 참여 시에만 · 선택)
  - 수집: 금융 정보 > **구매 내역**(다이아 구매·사용 내역, 서버 저장 · 앱 기능 목적)
  - 공유: 광고 ID → Google AdMob (광고 목적)
  - 전송 중 암호화: 예 / 삭제 요청: 예(랭킹 화면의 '내 랭킹 기록 삭제' 버튼 + 이메일)
  - **광고 포함: 예** / 인앱 구매: 예
- App Store(iOS 출시 때): 광고 ID와 사용자 콘텐츠 항목으로 "영양 성분표"를 다시 채웁니다. iOS에는 아직 StoreKit 결제가 없어서 유료 상품은 숨겨집니다.
- 삭제 안내 페이지: `delete.html`(저장소 `main`). Play 양식의 "계정 삭제 URL" 칸에는 로그인을 제공하기 전까지 필요하지 않습니다.

---

## 6. 연령 등급

- **Google Play**: IARC 설문에 답합니다. 폭력, 선정성, 도박은 "없음"입니다. 다만 **유료 아이템 구매(디지털 구매) "있음"**, **광고 "있음"**, 랭킹에 가게 이름이 다른 이용자에게 보이므로 **사용자 간 공유 "해당 여부"** 문항은 "가게 이름만 공개, 채팅 없음"으로 답합니다. 이 때문에 등급이 3+보다 올라갈 수 있습니다(제 추정). 한국 등급(게임물관리위원회)도 IARC 결과로 자동 처리됩니다.
- **타깃 연령**: Play Console의 '타깃층'에서 **13세 이상**만 고르세요. 어린이(13세 미만)를 고르면 가족 정책이 적용되어 지금의 광고·푸시 구성이 규칙에 맞지 않습니다. 앱 안의 광고 요청도 13세 이상 기준(어린이 대상 아님, 청소년 등급까지)으로 설정되어 있습니다.
- **App Store**: 연령 등급 설문의 모든 항목이 "없음"이면 가장 낮은 등급이 나옵니다.
- 참고로 게임 속 "원"(코인)은 가상 화폐이고, 실제 돈이 드는 것은 유료 아이템뿐이므로 "도박/모의 도박"에는 해당하지 않습니다. "불량 학생이 돈을 안 내고 도망가는" 장면은 폭력이 아니므로 "없음"으로 답하면 됩니다.
- 한국 App Store에 게임을 출시할 때는 등급분류 관련 확인 절차가 있을 수 있습니다. 제출할 때 App Store Connect 안내를 따르세요.

---

## 7. 스크린샷과 그래픽

**⏳ 순서: 스크린샷은 게임 개발이 모두 끝난 뒤에 찍습니다**(화면이 바뀌면 다시 찍어야 합니다). 지금은 아직 없습니다. Play 휴대폰 스크린샷 2장 이상이 필수입니다.

**⚠️ 스크린샷은 실제 게임 화면이어야 합니다.** 6.9"/6.5" 아이폰 스크린샷과 Play 스크린샷 모두 실제 기기나 시뮬레이터에서 실제로 플레이한 장면을 캡처하세요. 실제와 다른 목업은 심사에서 거절될 수 있습니다. 장면 위에 설명 문구를 얹는 것은 괜찮습니다.

| 어디 | 크기(px, 세로) | 개수 | 출처 |
|---|---|---|---|
| App Store 아이폰 6.9" | 1320×2868 (또는 1290×2796, 1260×2736) | 1~10장 | [App Store Connect 스크린샷 사양](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) (2026-11-09) |
| App Store 아이폰 6.5" | 1284×2778 또는 1242×2688 | 6.9"를 올렸다면 생략 가능 | 위와 같음 |
| 아이패드 13" | 2064×2752 | 아이폰 전용이라 필요 없음 | 위와 같음 |
| Google Play 휴대폰 | 세로 9:16 PNG/JPG, 짧은 변 320px 이상, 긴 변 3840px 이하 (1080×1920 권장) | 2~8장 | Play Console 등록정보 화면 |
| Google Play 그래픽 이미지 | 1024×500 | 1장 (필수) | `resources/play-feature-1024x500.png` |
| Google Play 앱 아이콘 | 512×512 | 1장 | `resources/play-icon-512.png` |

- 투명 배경(알파 채널)은 쓸 수 없습니다 (Apple).
- 쉽게 찍는 법: Mac의 Xcode 시뮬레이터에서 **iPhone 16 Pro Max**(6.9")를 켜고 ⌘S를 누르면 정확한 크기로 저장됩니다.
- 추천 장면: ① 아침 노점에서 굽는 장면 ② "뒤집어!" 순간 ③ 손님 줄과 동전 ④ 꾸미기 상점 ⑤ 스테인리스 푸드트럭 ⑥ 레트로 피처폰 스킨.

준비된 그래픽 파일 (`app/resources/`, 생성 스크립트: `make_store_art.py`):
- `icon-only.png` 1024×1024: 앱 아이콘 (투명 배경 없음, 글자 없음, 모서리는 스토어가 둥글게 처리)
- `icon-foreground.png` / `icon-background.png` 432×432: Android 적응형 아이콘
- `splash.png` 2732×2732: 시작 화면
- `icon-preview.png`: 64px와 180px에서 어떻게 보이는지 확인용 (스토어에 올리지 않음)

---

## 8. 스토어 등록정보 초안

글자 수 제한: App Store 이름 30자, 부제 30자, 키워드 100자(쉼표로 구분, 띄어쓰기 없이), 설명 4000자. Google Play 제목 30자, 간단한 설명 80자, 자세한 설명 4000자.

### 한국어

- **이름(제목)**: 붕어빵 타이쿤
- **부제 (App Store)**: 추억의 피처폰 붕어빵 장사 게임
- **간단한 설명 (Play, 80자 이내)**: 반죽 붓고, 팥 넣고, 뒤집어! 60단계를 깨고 푸드트럭 사장님이 되어 보세요.
- **키워드 (App Store)**: 붕어빵,타이쿤,장사,요리,가게,경영,피처폰,레트로,추억,간식,푸드트럭
- **자세한 설명**:
  > 그 시절 피처폰으로 하던 붕어빵 장사, 기억나세요?
  > 작은 나무 손수레에서 시작해 반짝이는 스테인리스 푸드트럭까지, 붕어빵 하나로 성공해 보세요!
  >
  > 🐟 굽는 재미
  > 반죽 붓기 → 속 넣기 → 반죽 덮기 → "뒤집어!" → "꺼내!"
  > 조금만 늦어도 까맣게 타 버려요. 타이밍이 생명!
  >
  > 🫘 네 가지 속
  > 팥, 슈크림, 피자, 그리고 푸드트럭에서만 파는 두바이 피스타치오!
  >
  > 👨‍👩‍👧 개성 있는 손님들
  > 아이와 가족, 학생, 할머니·할아버지, 밤에 12개씩 사 가는 직장인,
  > 돈 안 내고 도망가는 불량 학생, 공짜를 바라는 까칠한 손님까지.
  > 붕어빵을 노리는 고양이도 조심하세요!
  >
  > 🛒 키우는 재미
  > 틀 줄을 늘리고, 가스 불을 키우고, 노점을 꾸밀수록 붕어빵 값이 올라가요.
  > 60단계를 깨며 번 돈으로 반짝이는 스테인리스 푸드트럭까지!
  >
  > 📱 레트로 스킨
  > 버튼 하나로 도트 그래픽과 8비트 소리의 피처폰 감성으로 바뀌어요.
  >
  > ✔ 실시간 랭킹 ✔ 6개 언어 지원 ✔ 광고 포함 · 일부 유료 아이템(인앱 결제)

### English

- **Name (title)**: Bungeoppang Tycoon
- **Subtitle (App Store)**: Retro fish-bread stall game
- **Short description (Play, ≤80)**: Pour, fill, flip! Clear 60 stages and grow a street cart into a food truck.
- **Keywords (App Store)**: tycoon,cooking,shop,bakery,street food,korean,retro,taiyaki,snack,food truck,idle,timing
- **Full description**:
  > Remember the fish-shaped bread stall game on your old flip phone? It's back!
  > Start with a tiny wooden cart and grow it into a shiny stainless food truck, one bungeoppang (Korean fish bread) at a time.
  >
  > 🐟 BAKE WITH TIMING
  > Pour batter → add filling → cover → "Flip!" → "Take!"
  > Wait too long and it burns. Timing is everything!
  >
  > 🫘 FOUR FILLINGS
  > Red bean, custard, pizza, and the food-truck-only Dubai pistachio.
  >
  > 👨‍👩‍👧 QUIRKY CUSTOMERS
  > Kids and families, students, grandparents, night-shift office workers buying 12-packs,
  > troublemakers who run off without paying, and grumpy guests who want one for free.
  > And watch out for the cat!
  >
  > 🛒 UPGRADE YOUR STALL
  > More mold rows, a hotter stove, and decorations that raise your price.
  > Clear 60 stages and earn your way up to the shiny stainless food truck!
  >
  > 📱 RETRO SKIN
  > One tap turns on pixel art and 8-bit sounds, just like the feature-phone days.
  >
  > ✔ Live ranking ✔ 6 languages ✔ Contains ads and optional in-app purchases
  >
  > The English version includes a step-by-step tutorial.

- **카테고리**: 게임 → 시뮬레이션 (보조 카테고리: 캐주얼)
- **가격**: 무료 (가격을 받으려면 Apple 유료 앱 계약과 Play 판매자 계정의 세금·은행 정보가 추가로 필요합니다)

---

## 9. 출시 직전 최종 점검

- ☐ `npm run sync`를 실행한 다음 빌드했는지
- ☐ 실제 기기에서 확인: 홈 버튼으로 나갔다 돌아오면 게임이 멈춰 있고 이어서 할 수 있는지, Android 뒤로가기를 누르면 열린 창이 닫히는지
- ☐ 비행기 모드에서도 실행되는지 (글꼴 문제가 해결됐는지)
- ☐ 앱 ID, 버전, 빌드 번호
- ☐ 개인정보처리방침 URL과 지원 이메일
- ☐ 키스토어 백업 (Android)
