# 네이버 지도 API 사용 가이드

## 1. API 키 발급

### 단계별 가이드

1. **네이버 클라우드 플랫폼 접속**
   - https://www.ncloud.com 접속
   - 회원가입 또는 로그인

2. **Application 등록**
   - Console > Services > AI·NAVER API > AI·NAVER API 선택
   - "Application 등록" 클릭
   - Application 이름 입력 (예: "Feel Web App")
   - Service 선택: **Maps (Web Dynamic Map v3)** 체크
   - 등록 완료

3. **Client ID 확인**
   - 등록한 Application 클릭
   - Client ID 복사 (Client Secret은 필요 없음)

## 2. 환경 변수 설정

프로젝트 루트의 `.env` 파일에 추가:

```bash
# 기존 카카오 지도 (선택사항 - 제거 가능)
REACT_APP_KAKAOAPIKEY=your_kakao_key

# 네이버 지도 API
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id_here
```

## 3. 주요 차이점

### 카카오 지도 vs 네이버 지도

| 항목 | 카카오 지도 | 네이버 지도 |
|------|------------|------------|
| API 키 | App Key | Client ID |
| 스크립트 로드 | `dapi.kakao.com` | `oapi.map.naver.com` (신규 API) |
| 좌표 순서 | (위도, 경도) | (위도, 경도) - 동일 |
| 지도 생성 | `new kakao.maps.Map()` | `new naver.maps.Map()` |
| 마커 생성 | `new kakao.maps.Marker()` | `new naver.maps.Marker()` |
| 지오코딩 | `kakao.maps.services.Geocoder()` | `naver.maps.Service.geocode()` |

## 4. 코드 변경 예시

### 기존 카카오 지도 코드
```javascript
// 카카오 지도
const map = new window.kakao.maps.Map(container, {
  center: new window.kakao.maps.LatLng(lat, lng),
  level: 3
});
```

### 네이버 지도 코드
```javascript
// 네이버 지도
const map = new window.naver.maps.Map(container, {
  center: new window.naver.maps.LatLng(lat, lng),
  zoom: 15
});
```

## 5. 컴포넌트 사용법

### 기본 사용
```jsx
import Naver from './component/home/maps/naver.jsx';

<Naver 
  lat={35.8464522} 
  lng={127.1296552} 
  address="전주시 덕진구 백제대로 567"
  containerStyle={{ minHeight: '360px' }}
/>
```

### Props 설명
- `lat`: 위도 (선택사항)
- `lng`: 경도 (선택사항)
- `address`: 주소 문자열 (선택사항, lat/lng이 없을 때 사용)
- `containerStyle`: 지도 컨테이너 스타일 (선택사항)

## 6. 지오코딩 (주소 → 좌표)

```javascript
window.naver.maps.Service.geocode({
  query: '전주시 덕진구 백제대로 567'
}, (status, response) => {
  if (status === window.naver.maps.Service.Status.ERROR) {
    console.error('지오코딩 실패');
    return;
  }
  
  const item = response.v2.addresses[0];
  const lat = parseFloat(item.y);
  const lng = parseFloat(item.x);
  
  // 지도에 마커 표시
  const position = new window.naver.maps.LatLng(lat, lng);
  const marker = new window.naver.maps.Marker({
    position: position,
    map: map
  });
});
```

## 7. 마커 커스터마이징

```javascript
const marker = new window.naver.maps.Marker({
  position: new window.naver.maps.LatLng(lat, lng),
  map: map,
  icon: {
    content: '<div style="background: red; width: 20px; height: 20px; border-radius: 50%;"></div>',
    anchor: new window.naver.maps.Point(10, 10)
  },
  title: '마커 제목'
});
```

## 8. 이벤트 리스너

```javascript
// 클릭 이벤트
window.naver.maps.Event.addListener(map, 'click', (e) => {
  console.log('클릭 위치:', e.coord.lat(), e.coord.lng());
});

// 마커 클릭 이벤트
window.naver.maps.Event.addListener(marker, 'click', () => {
  console.log('마커 클릭됨');
});
```

## 9. 주의사항

1. **신규 API 전환**: 네이버 지도 API는 신규 버전으로 전환되었습니다.
   - 기존 `openapi.map.naver.com` → 신규 `oapi.map.naver.com` 사용
   - 신규 클라이언트 아이디 발급 필요 (기존 아이디도 작동하지만 신규 권장)
   - 공지사항: https://www.ncloud.com/support/notice/all/1930
   - 변경 가이드: https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html

2. **도메인 등록**: 네이버 클라우드 플랫폼에서 사용할 도메인을 등록해야 합니다.
   - Application 설정 > Web Service URL에 도메인 추가
   - 예: `http://localhost:3000`, `https://yourdomain.com`

3. **API 사용량**: 무료 사용량 제한이 있습니다.
   - 월 30,000건 (지도 로드)
   - 월 10,000건 (지오코딩)

4. **HTTPS**: 프로덕션 환경에서는 HTTPS가 필요합니다.

5. **Service 객체 로딩**: 지오코딩을 사용할 경우 `Service` 객체가 완전히 로드될 때까지 대기해야 합니다.
   - `submodules=geocoder` 파라미터 필수
   - `window.naver.maps.Service` 존재 여부 확인 후 사용

## 10. 참고 자료

- 네이버 지도 API 공식 문서: https://navermaps.github.io/maps.js.ncp/
- 네이버 클라우드 플랫폼: https://www.ncloud.com

