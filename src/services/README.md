# API 서비스 사용 가이드

프론트엔드에서 백엔드 API와 통신하기 위한 중앙화된 서비스 함수들입니다.

## 기본 구조

```
src/services/
├── api.js              # 기본 HTTP 요청 함수 (get, post, put, delete 등)
├── authApi.js          # 인증 관련 API
├── noticesApi.js       # 공지사항 API
├── galleryApi.js       # 갤러리 API
├── inspectionApi.js    # 시설 점검 API
├── resourcesApi.js     # 자료실 API
├── index.js            # 통합 export
└── README.md          
```

## 기본 사용법

### 1. 기본 API 함수 직접 사용

```javascript
import { get, post, put, del } from './services/api';

// GET 요청
const data = await get('/api/notices', { page: 0, size: 10 });

// POST 요청
const result = await post('/api/notices', {
  title: '제목',
  content: '내용',
  category: '공지',
});

// PUT 요청
await put('/api/notices/1', {
  title: '수정된 제목',
});

// DELETE 요청
await del('/api/notices/1');
```

### 2. 도메인별 API 함수 사용 (권장)

```javascript
import { noticesApi } from './services';

// 공지사항 목록 조회
const notices = await noticesApi.getNotices({
  page: 0,
  size: 10,
  category: '공지',
  keyword: '검색어',
});

// 공지사항 상세 조회
const notice = await noticesApi.getNoticeDetail(1);

// 공지사항 생성
await noticesApi.createNotice({
  title: '제목',
  content: '내용',
  category: '공지',
  pinned: false,
});
```

## 상세 사용 예시

### 공지사항 API

```javascript
import { noticesApi } from './services';

// 목록 조회 (페이지네이션)
const response = await noticesApi.getNotices({
  page: 0,
  size: 10,
  category: '공지',
  keyword: '검색어',
});
// 응답: { content: [...], totalPages: 5, totalElements: 50, ... }

// 고정 공지사항 조회
const pinnedNotices = await noticesApi.getPinnedNotices();

// 상세 조회
const notice = await noticesApi.getNoticeDetail(1);

// 생성
const newNotice = await noticesApi.createNotice({
  title: '새 공지사항',
  content: '내용',
  category: '공지',
  pinned: false,
});

// 수정
await noticesApi.updateNotice(1, {
  title: '수정된 제목',
});

// 삭제
await noticesApi.deleteNotice(1);

// 고정/고정 해제
await noticesApi.toggleNoticePin(1, true);
```

### 갤러리 API

```javascript
import { galleryApi } from './services';

// 목록 조회
const galleries = await galleryApi.getGalleries({
  page: 0,
  size: 12,
  category: '행사',
});

// 이미지 업로드 (진행률 추적)
await galleryApi.uploadImages(files, (progress) => {
  console.log(`업로드 진행률: ${progress}%`);
});
```

### 시설 점검 API

```javascript
import { inspectionApi } from './services';

// 점검 목록 조회
const inspections = await inspectionApi.getInspections({
  page: 0,
  year: '2024',
  month: '12',
});

// 점검 생성
const newInspection = await inspectionApi.createInspection({
  period: '2024-12',
  title: '12월 시설 점검',
  description: '점검 내용',
});

// 이미지 업로드
await inspectionApi.uploadInspectionImages(1, files, (progress) => {
  console.log(`이미지 업로드: ${progress}%`);
});
```

### 자료실 API

```javascript
import { resourcesApi } from './services';

// 자료 목록 조회
const resources = await resourcesApi.getResources({
  page: 0,
  category: 'constitution',
});

// 자료 생성 (파일 첨부)
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);

await resourcesApi.createResource({
  category: 'finance',
  title: '회계 내역',
  content: '내용',
  files: [file1, file2],
});

// 회계 내역 조회
const financeRecords = await resourcesApi.getFinanceRecords({
  year: '2024',
  month: '12',
});
```

### 인증 API

```javascript
import { authApi } from './services';

// 로그인
const response = await authApi.login({
  username: 'admin',
  password: 'password',
});
// 토큰이 자동으로 localStorage에 저장됨

// 현재 사용자 정보 조회
const user = await authApi.getCurrentUser();

// 로그인 상태 확인
if (authApi.isAuthenticated()) {
  console.log('로그인됨');
}

// 사용자 정보 가져오기 (로컬)
const userInfo = authApi.getUserInfo();

// 로그아웃
await authApi.logout();
```

## React 컴포넌트에서 사용 예시

```javascript
import React, { useState, useEffect } from 'react';
import { noticesApi } from '../services';

function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await noticesApi.getNotices({ page: 0, size: 10 });
      setNotices(response.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (noticeData) => {
    try {
      await noticesApi.createNotice(noticeData);
      await loadNotices(); // 목록 새로고침
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      {notices.map(notice => (
        <div key={notice.id}>{notice.title}</div>
      ))}
    </div>
  );
}
```

## 환경 변수 설정

`.env` 파일에 API URL 설정:

```env
REACT_APP_API_URL=http://localhost:8080
```

프로덕션에서는:
```env
REACT_APP_API_URL=https://api.jbnu-coe.com
```

## 에러 처리

모든 API 함수는 에러를 throw하므로 try-catch로 처리해야 합니다:

```javascript
try {
  const data = await noticesApi.getNotices();
} catch (error) {
  console.error('에러:', error.message);
  // 사용자에게 에러 메시지 표시
  alert(error.message);
}
```

## 백엔드 미구현 시 대응

백엔드가 아직 준비되지 않았을 때는:

1. **Mock 데이터 사용**: 각 API 함수에서 먼저 Mock 데이터를 반환하도록 구현
2. **로컬 상태 사용**: 컴포넌트에서 로컬 상태로 먼저 개발하고, 나중에 API 호출로 교체
3. **환경 변수로 제어**: `REACT_APP_USE_MOCK=true` 같은 플래그로 Mock/실제 API 전환

예시:

```javascript
// api.js
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

export async function get(endpoint, params = {}) {
  if (USE_MOCK) {
    return getMockData(endpoint, params);
  }
  
  return fetchAPI(endpoint, { method: 'GET' });
}
```

## 주의사항

1. 모든 API 함수는 Promise를 반환하므로 `await` 또는 `.then()` 사용 필요
2. 파일 업로드는 `FormData`를 사용하며, `Content-Type`이 자동으로 `multipart/form-data`로 설정됨
3. 인증 토큰은 `localStorage`에 저장되며, 자동으로 요청 헤더에 포함됨
4. 타임아웃은 기본 30초이며, `api.js`에서 조정 가능

## 다음 단계

백엔드 API가 준비되면:

1. `.env` 파일에 실제 API URL 설정
2. 각 API 함수의 엔드포인트 경로 확인 및 필요시 수정
3. 응답 데이터 형식에 맞게 컴포넌트 코드 조정
4. 에러 처리 및 예외 상황 테스트
