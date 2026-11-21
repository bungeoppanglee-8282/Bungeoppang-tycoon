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

게임 원본은 `game/` 폴더에 있습니다. 앱은 이 폴더를 `app/www`로 복사해서 씁니다.

```bash
cd app
npm install          # 처음 한 번만
npm run sync         # game → www 복사(BRIEF.md 제외) + 안드로이드/iOS 프로젝트에 반영
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
7. ☐ 그동안 스토어 등록정보, 콘텐츠 등급, 데이터 보안, 타깃 연령, 광고 여부(없음)를 채웁니다.
8. ☐ 14일이 지나면 **프로덕션 액세스 신청** → 심사 → 출시.

### 3-1. 인앱 상품 등록 (Play Console, 진짜 결제용)

앱에는 Google Play 결제가 연결되어 있습니다(`BillingPlugin.kt`, `web/js/iap.js`). **아래 상품을 콘솔에 먼저 만들어야** 상점에 유료 상품이 나타납니다. 상품이 없거나 ID가 다르면 그 상품은 숨겨집니다.

- ☐ Play Console → **수익 창출 → 제품 → 인앱 상품 → 인앱 상품 만들기**. 유형은 일회성 구매입니다. 제품 ID는 아래 표와 **한 글자도 다르지 않게** 입력하세요.
- ☐ 상품을 만들 때 **활성**으로 바꾸고, 가격은 대한민국 기준으로 입력합니다(다른 나라는 자동 환산 가능).
- ☐ 판매자 프로필(세금·은행 정보)이 필요합니다. 없으면 결제가 열리지 않습니다.
- ☐ 테스트: Play Console → 설정 → **라이선스 테스트**에 내 구글 계정을 등록하면 실제로 돈이 나가지 않고 결제를 시험할 수 있습니다. 서명한 앱 번들을 **비공개 테스트 트랙**에 올린 뒤, 그 트랙에서 설치한 앱으로만 결제 시험이 됩니다(USB로 설치한 디버그 앱은 안 됩니다).

| 제품 ID | 이름 | 권장 가격 | 종류 |
|---|---|---|---|
| `noads` | 광고 제거 | ₩4,900 | 영구(한 번만) |
| `pat2` | 인내심 연장 | ₩3,900 | 영구 |
| `rack2` | 틀 추가 | ₩2,900 | 영구 |
| `minibag` | 미니 붕어빵 20개 팩 | ₩2,200 | 소모성(여러 번) |
| `attpack` | 출석 선물 팩 | ₩5,400 | 소모성 |
| `bake` | 즉시 굽기 20개 팩 | ₩3,900 | 소모성 |
| `ice` | 얼음 시간 3개 팩 | ₩2,900 | 소모성 |

- 앱 안의 가격 표시는 콘솔에 입력한 가격이 자동으로 쓰입니다(나라별 통화 포함).
- 결제가 끝났는데 게임에 지급되지 않은 경우(앱이 꺼졌을 때 등)는 다음에 앱을 켤 때 자동으로 지급됩니다. 영구 상품은 앱을 다시 설치해도 복원됩니다.
- 한계: 서버에서 영수증을 다시 확인하지 않습니다. 루팅된 기기에서 결제를 속이는 것은 막지 못합니다. 문제가 생기면 Cloud Function으로 구매 토큰 검증을 추가하세요.

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

## 5. 개인정보처리방침

- 게임 진행 상황(돈, 날짜, 설정)은 **기기 안(localStorage)에만** 저장됩니다. 서버, 로그인, 광고, 분석 도구, 결제가 모두 없습니다.
- 그래도 **두 스토어 모두 개인정보처리방침 URL이 필수**입니다. 노션 공개 페이지나 GitHub Pages 한 장이면 충분합니다.
- ⚠️ **확인 필요**: 현재 `game/index.html`이 Google Fonts(fonts.googleapis.com)를 **인터넷에서 불러옵니다.** 이렇게 되면 ① 오프라인에서 글꼴이 바뀌고 ② 사용자의 IP가 Google로 전송됩니다. 출시 전에 글꼴 파일을 게임 폴더 안에 넣는 것(self-host)을 강력히 권합니다. 그러면 "어떤 데이터도 외부로 전송하지 않음"이라고 쓸 수 있습니다. (팀 규칙 "런타임 네트워크 요청 없음"에도 맞습니다.)
- App Store 개인정보 항목: **"데이터를 수집하지 않음"**. Play 데이터 보안: **수집·공유하는 데이터 없음**. 글꼴 문제를 해결한 다음 기준입니다.

방침 초안 (붙여 넣어서 쓰세요):
> **붕어빵 타이쿤 개인정보처리방침**
> 붕어빵 타이쿤은 어떠한 개인정보도 수집, 저장, 전송하지 않습니다. 게임 진행 상황은 사용자의 기기 안에만 저장되며, 앱을 삭제하면 함께 삭제됩니다. 광고, 분석 도구, 로그인, 인앱 결제를 사용하지 않습니다. 문의: [이메일]
> 시행일: 20XX-XX-XX

---

## 6. 연령 등급

- **Google Play**: IARC 설문에 답합니다. 폭력, 선정성, 도박, 실제 돈 결제, 사용자 간 소통이 모두 "없음"이면 보통 **전체이용가(3+)**가 나옵니다. 한국 등급(게임물관리위원회)도 IARC 결과로 자동 처리됩니다.
- **App Store**: 연령 등급 설문의 모든 항목이 "없음"이면 가장 낮은 등급이 나옵니다.
- 참고로 게임 속 "원"은 가상 화폐이고 실제 결제가 아니므로 "도박/모의 도박"에는 해당하지 않습니다. "불량 학생이 돈을 안 내고 도망가는" 장면은 폭력이 아니므로 "없음"으로 답하면 됩니다.
- 한국 App Store에 게임을 출시할 때는 등급분류 관련 확인 절차가 있을 수 있습니다. 제출할 때 App Store Connect 안내를 따르세요.

---

## 7. 스크린샷과 그래픽

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
- **간단한 설명 (Play, 80자 이내)**: 반죽 붓고, 팥 넣고, 뒤집어! 30일 안에 푸드트럭 사장님이 되어 보세요.
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
  > 목표는 30일 안에 50만 원짜리 스테인리스 푸드트럭!
  >
  > 📱 레트로 스킨
  > 버튼 하나로 도트 그래픽과 8비트 소리의 피처폰 감성으로 바뀌어요.
  >
  > ✔ 광고 없음 ✔ 인앱 결제 없음 ✔ 인터넷 없이 플레이 ✔ 한국어/영어 지원

### English

- **Name (title)**: Bungeoppang Tycoon
- **Subtitle (App Store)**: Retro fish-bread stall game
- **Short description (Play, ≤80)**: Pour, fill, flip! Grow a street cart into a food truck in 30 days.
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
  > Goal: buy the 500,000-won food truck within 30 days.
  >
  > 📱 RETRO SKIN
  > One tap turns on pixel art and 8-bit sounds, just like the feature-phone days.
  >
  > ✔ No ads ✔ No in-app purchases ✔ Plays offline ✔ Korean & English
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
