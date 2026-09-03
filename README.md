# JBNU-COE 공과대학 학생회 웹사이트 (Frontend)

전북대학교 공과대학 학생회 공식 웹사이트의 프론트엔드입니다.
공지사항·학사일정·시설 대여·제휴 혜택·활동 모집 등 학생회 서비스를 제공합니다.

- **Stack**: React 19 + React Router 7 + Create React App (react-scripts 5)
- **배포**: Docker(nginx) 기반 운영 배포 / GitHub Pages 프리뷰 배포

---

## 시작하기

### 요구 사항

- Node.js 18 이상 (CI/Docker 기준 18~20)
- npm

### 설치 및 실행

```bash
npm ci                # 의존성 설치
cp .env.example .env  # 환경 변수 파일 생성 후 값 채우기
npm start             # 개발 서버 (http://localhost:3000)
```

### 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm start` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 (`prebuild`가 먼저 실행됨) |
| `npm run prebuild` | `public/notices/*.md` → `notices.index.json` 생성 |
| `npm test` | 테스트 실행 (react-scripts / Testing Library) |
| `npm run deploy` | `gh-pages`로 `build/` 배포 |

> 빌드 경고를 에러로 승격시키지 않으려면 `CI=false npm run build` (Docker/CI에서 사용 중인 방식).

---

## 환경 변수

CRA 규칙에 따라 `REACT_APP_` 접두사가 붙은 값만 번들에 주입되며, **빌드 시점에 고정**됩니다.
런타임에 바꿀 수 없으므로 배포 환경마다 다시 빌드해야 합니다.

| 변수 | 필수 | 용도 |
| --- | --- | --- |
| `REACT_APP_API_URL` | ✅ | 백엔드 API 베이스 URL. 미설정 시 `http://localhost:8080` |
| `REACT_APP_GOOGLE_CLIENT_ID` | ✅ | Google OAuth 로그인 클라이언트 ID |
| `REACT_APP_NAVER_CLIENT_ID` | ✅ | 네이버 지도(제휴 혜택 / 위치 안내) |
| `REACT_APP_KAKAOAPIKEY` | 선택 | 카카오 지도(`src/component/home/maps/kakao.jsx`) 사용 시 |

`.env`는 `.gitignore`에 포함되어 있습니다. 키를 커밋하지 마세요. 템플릿은 `.env.example` 참고.

---

## 디렉터리 구조

```
src/
├── App.jsx                 # 라우트 정의 (BrowserRouter)
├── index.jsx               # 진입점, AuthProvider + GoogleOAuthProvider
├── component/
│   ├── about/              # 학생회 소개, 조직도
│   ├── activities/         # 활동 목록/상세/모집 신청
│   ├── auth/               # 로그인 페이지
│   ├── benefits/           # 제휴 혜택 (partnersData.js)
│   ├── contact/            # 제보, 게시판 문의, 카카오 채널
│   ├── home/               # 메인 (카드 섹션, 슬라이더, 캘린더, 지도)
│   ├── hooks/              # useResponsive, useLayoutResize
│   ├── matching/           # 매칭 목록/상세
│   ├── notice/             # 공지, 갤러리, 학사일정, 학습지원
│   ├── pledge/             # 공약 이행률
│   ├── resources/          # 건물 안내도, 회칙, 대여, 시설점검, 재정
│   └── ErrorBoundary.jsx
├── contexts/AuthContext.jsx
├── layouts/                # topBar, headerBar, banner, floatingButton
├── services/               # API 레이어 (도메인별 모듈)
├── utils/                  # dday, holidays
└── img/                    # 정적 이미지 에셋
public/
├── feel_calendar/, maps/   # 페이지에서 직접 참조하는 이미지
├── notices/                # (선택) 마크다운 공지 원본
└── calendar.json
scripts/
├── generate-notices-index.mjs  # prebuild에서 실행
└── fetch-notion.mjs            # Notion 공지 동기화(선택)
```

---

## 라우트

| 경로 | 화면 |
| --- | --- |
| `/` | 메인 |
| `/about/intro`, `/about/organization` | 학생회 소개, 조직도 |
| `/notice` | 공지 허브 |
| `/notice/announcement`, `/notice/announcement/:id` | 공지 목록 / 상세 |
| `/notice/gallery` | 갤러리 (ErrorBoundary 적용) |
| `/notice/study-support` | 학습 지원 |
| `/notice/calendar` | 월간 학사일정 |
| `/notice/pledge` | 공약 이행 현황 |
| `/benefits` | 제휴 혜택 |
| `/contact`, `/contact/report`, `/contact/board-inquiry`, `/contact/kakao-channel` | 문의·제보 |
| `/resources` | 자료실 허브 |
| `/resources/map`, `/constitution`, `/rental`, `/finance`, `/inspection` | 건물 안내도, 회칙, 대여, 재정, 시설점검 |
| `/matching`, `/matching/:id` | 매칭 목록 / 상세 |
| `/activities`, `/activities/recruit`, `/activities/:id` | 활동 목록 / 모집 신청 / 상세 |
| `/login` | Google 로그인 |

SPA이므로 서버에서 모든 경로를 `index.html`로 폴백해야 합니다 (`nginx.conf`의 `try_files` 설정 참고).

---

## API 레이어

모든 HTTP 호출은 `src/services/api.js`를 거칩니다.

- `getApiUrl()` — `REACT_APP_API_URL` 기준 베이스 URL (후행 슬래시 제거)
- `get / post / put / patch / del` — JSON 요청 래퍼. 30초 타임아웃(`AbortController`), 에러 메시지 한글화
- `uploadFile(endpoint, formData, onProgress)` — `XMLHttpRequest` 기반 업로드 + 진행률 콜백
- `getResourceFileUrl(fileUrl)` — 로컬에서 업로드되어 `localhost`로 저장된 파일 URL을 현재 API 호스트로 치환
- 인증 토큰은 `localStorage.authToken`에서 읽어 `Authorization: Bearer` 헤더로 자동 첨부 (시크릿 모드 등에서 접근 실패 시 무시)

도메인별 모듈은 `src/services/index.js`에서 통합 export 됩니다.

| 모듈 | 주요 엔드포인트 |
| --- | --- |
| `noticesApi` | `/api/notices`, `/api/notices/pinned` |
| `galleryApi` | `/api/gallery`, `/api/gallery/upload` |
| `calendarApi` | `/api/calendar/events` |
| `resourcesApi` | `/api/resources`, `/api/resources/by-period` |
| `rentalApi` | `/api/rental`, `/api/rental/categories` |
| `financeApi` | `/api/finance/reports`, `/api/finance/reports/upload` |
| `matchingApi` | `/api/matching` |
| `activityApi` | `/api/activities` |
| `pledgeApi` | `/api/pledges/progress` |
| `authApi` | `/api/auth` |

### 사용 예

```jsx
import { noticesApi } from '../../services';

const data = await noticesApi.getNotices({ page: 0, size: 10 });
```

---

## 인증

Google OAuth(`@react-oauth/google`) + 자체 JWT 구조입니다.

1. `index.jsx`가 `GoogleOAuthProvider`와 `AuthProvider`로 앱을 감쌉니다.
2. 로그인 시 Google `idToken`을 `/api/auth`로 전달해 서비스 토큰을 교환합니다.
3. 신규 사용자는 `needSignup: true` 응답을 받고 닉네임 입력 후 `completeSignup()`으로 가입을 마칩니다.
4. 토큰은 `localStorage.authToken`에 저장되고, 앱 시작 시 `verifyToken()`으로 검증합니다. 실패하면 토큰을 폐기합니다.

컴포넌트에서는 `useAuth()`로 접근합니다.

```jsx
const { isAuthenticated, userNickname, isLoading, login, logout } = useAuth();
```

---

## 반응형

`src/component/hooks/useResponsive.jsx`가 브레이크포인트를 단일 관리합니다.

| 값 | 범위 |
| --- | --- |
| `isMobile` | ~767px |
| `isTablet` | 768~1199px |
| `isLaptop` | 1200~1439px |
| `isDesktop` | 1440px~ |

`isMobileOrTablet`, `isNotMobile` 파생 값도 제공합니다. 컴포넌트에서 미디어 쿼리를 직접 작성하기보다 이 훅을 사용하세요.

---

## 공지 데이터

`npm run build` 시 `prebuild`가 `scripts/generate-notices-index.mjs`를 실행합니다.

- `public/notices/*.md`를 스캔해 첫 `# 제목`을 title로, 파일명의 `YYYY-MM-DD` 또는 mtime을 date로 추출
- 최신순 정렬 후 `src/component/notice/announcement/notices.index.json`에 기록
- `public/notices/`가 없으면 경고만 남기고 정상 종료(빌드 실패 아님)

`scripts/fetch-notion.mjs`는 Notion(`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NOTION_PAGE_IDS`)에서 공지를 가져오는 선택적 스크립트입니다.

---

## 배포

### 운영 (main → 자체 서버, Docker)

`.github/workflows/deploy.yml`이 `main` push마다 SSH로 서버에 접속해 `docker compose build --no-cache user-front` 후 재기동합니다.
`Dockerfile`은 멀티 스테이지 구성으로, 빌드 스테이지에서 `--build-arg`로 받은 `REACT_APP_*`를 주입해 빌드하고 결과물을 `nginx:alpine`으로 서빙합니다.

로컬에서 이미지 빌드:

```bash
docker build \
  --build-arg REACT_APP_API_URL=https://api.example.com \
  --build-arg REACT_APP_GOOGLE_CLIENT_ID=... \
  --build-arg REACT_APP_NAVER_CLIENT_ID=... \
  -t jbnu-coe-front .

docker run -p 8080:80 jbnu-coe-front
```

`nginx.conf`는 SPA 폴백, gzip 압축, 정적 파일 1년 캐싱, 기본 보안 헤더를 설정합니다.

### 프리뷰 (develop → GitHub Pages)

`.github/workflows/preview-deploy.yml`이 `develop` push 또는 수동 실행 시 GitHub Pages로 배포합니다.
`REACT_APP_*` 값은 리포지토리 Secrets에서 주입되며, 서브디렉터리 배포를 위해 `PUBLIC_URL`을 설정합니다.

---

## 기여

1. `develop`에서 브랜치를 생성합니다 (`feature/...`, `fix/...`).
2. 커밋 메시지는 기존 히스토리를 따릅니다 (`Feat: `, `Fix: `, `Refactor: ` 등).
3. `npm run build`가 통과하는지 확인한 뒤 `develop`으로 PR을 올립니다.
4. 시크릿(`.env`, API 키)이 diff에 포함되지 않았는지 확인합니다.
