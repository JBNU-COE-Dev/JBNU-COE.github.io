import React, { useEffect, useRef, useState } from 'react';
import './benefits.css';
import { partners } from './partnersData.js';

// ===== 전역 유틸: 요청 큐(직렬화) + 결과 캐시 =====
const MAX_CONCURRENCY = 1;       // 동시에 처리할 최대 작업 개수
const QUEUE_INTERVAL_MS = 800;   // 작업 간 간격(ms) — 429 완화 위해 증가
const GEO_CACHE_STORAGE_KEY = 'feel_geo_cache_v1';

const taskQueue = [];
let activeTasks = 0;
const inFlightMap = new Map();   // 같은 키(주소/업체명) 동시 중복 호출 방지

// 메모리 캐시 초기화 및 localStorage 로드
const locationCache = (() => {
  const m = new Map();
  try {
    const raw = localStorage.getItem(GEO_CACHE_STORAGE_KEY);
    if (raw) {
      const entries = JSON.parse(raw);
      if (Array.isArray(entries)) {
        for (const [k, v] of entries) m.set(k, v);
      }
    }
  } catch (_) {}
  return m;
})();

const persistCache = () => {
  try {
    localStorage.setItem(GEO_CACHE_STORAGE_KEY, JSON.stringify(Array.from(locationCache.entries())));
  } catch (_) {}
};

const cacheGet = (key) => locationCache.get(key);
const cacheSet = (key, value) => {
  locationCache.set(key, value);
  persistCache();
};

const processQueue = () => {
  if (activeTasks >= MAX_CONCURRENCY) return;
  const next = taskQueue.shift();
  if (!next) return;
  activeTasks += 1;
  const run = () => {
    next.fn()
      .then((r) => next.resolve(r))
      .catch((e) => next.reject(e))
      .finally(() => {
        activeTasks -= 1;
        setTimeout(processQueue, QUEUE_INTERVAL_MS);
      });
  };
  run();
};

const enqueueTask = (fn) => new Promise((resolve, reject) => {
  taskQueue.push({ fn, resolve, reject });
  processQueue();
});

const withDedup = (key, producer) => {
  if (inFlightMap.has(key)) return inFlightMap.get(key);
  const p = enqueueTask(producer).finally(() => inFlightMap.delete(key));
  inFlightMap.set(key, p);
  return p;
};

// 주소 정규화: 간략 표기 보정(전북/전주/덕진구 접두가 없으면 붙임)
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeAddress = (raw, name) => {
  if (!raw) return '';
  let out = String(raw).trim();
  // 1) 주소 끝에 상호명이 붙은 케이스 제거 (예: "... 2층 만계치킨")
  if (name) {
    const reTailName = new RegExp(`\\s*${escapeRegExp(name)}\\s*$`, 'u');
    out = out.replace(reTailName, '').trim();
  }
  // 2) 중복 공백/특수문자 정리
  out = out.replace(/[.]{2,}/g, '.').replace(/\s{2,}/g, ' ').replace(/\s*[.,]\s*/g, ' ');
  // 3) "도/시/구" 접두가 없으면 지역 프리픽스 부여
  const hasCity = /전주|전북|특별자치|덕진구/.test(out);
  if (!hasCity) out = `전북특별자치도 전주시 덕진구 ${out}`;
  return out.trim();
};

// Naver Maps SDK를 동적으로 로드하는 헬퍼
// - 환경변수(REACT_APP_NAVER_CLIENT_ID)로부터 키를 읽어옵니다
const loadNaverIfNeeded = () => {
  return new Promise((resolve, reject) => {
    const key = process.env.REACT_APP_NAVER_CLIENT_ID;
    if (!key) {
      console.warn('[NAVER] REACT_APP_NAVER_CLIENT_ID가 설정되지 않았습니다. 지도 기능이 비활성화됩니다.');
      return resolve(); // 에러 대신 성공으로 처리
    }
    if (window.naver && window.naver.maps) {
      console.log('[NAVER] SDK already loaded. key(len):', String(key).length);
      // Service 객체도 확인 (지오코딩 사용 시 필요)
      if (window.naver.maps.Service) {
        resolve();
      } else {
        // Service 객체가 아직 준비되지 않았으면 대기
        const checkServiceReady = () => {
          if (window.naver && window.naver.maps && window.naver.maps.Service) {
            resolve();
          } else {
            setTimeout(checkServiceReady, 100);
          }
        };
        checkServiceReady();
      }
      return;
    }
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${key}&submodules=geocoder`;
    script.async = true;
    script.onload = () => {
      console.log('[NAVER] SDK loaded. key(len):', String(key).length);
      // Service 객체가 준비될 때까지 대기
      const checkServiceReady = () => {
        if (window.naver && window.naver.maps && window.naver.maps.Service) {
          resolve();
        } else {
          // Service 객체가 아직 준비되지 않았으면 100ms 후 다시 확인
          setTimeout(checkServiceReady, 100);
        }
      };
      checkServiceReady();
    };
    script.onerror = () => {
      console.error('[NAVER] SDK 스크립트 로드 실패');
      reject(new Error('Naver SDK load failed'));
    };
    document.head.appendChild(script);
  });
};

// 주소 → 좌표 (지오코딩). 캐시/직렬화/중복제거 적용
const geocodeByAddress = async (addr) => {
  const key = `addr:${addr}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  return withDedup(key, () => new Promise((resolve) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      console.warn('[NAVER] Service 객체가 준비되지 않았습니다.');
      resolve(null);
      return;
    }
    window.naver.maps.Service.geocode({
      query: addr
    }, (status, response) => {
      if (status === window.naver.maps.Service.Status.ERROR) {
        resolve(null);
        return;
      }
      if (response.v2.meta.totalCount === 0) {
        resolve(null);
        return;
      }
      const item = response.v2.addresses[0];
      const y = parseFloat(item.y);
      const x = parseFloat(item.x);
      const out = { lat: y, lng: x };
      cacheSet(key, out);
      resolve(out);
    });
  }));
};

// (요청에 따라 비활성화) 업체명 키워드 검색은 사용하지 않습니다.

// 단일 제휴업체 블록 컴포넌트
// - 좌측: 네이버맵, 우측: 업체 정보
// - 좌표(lat/lng)가 없을 경우 주소 → 지오코딩 → 마커 표시
const BenefitsPartner = ({ name, address, phone, benefits = [], lat, lng }) => {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markerRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return; // 개발모드 StrictEffect 중복 방지
    initializedRef.current = true;
    
    loadNaverIfNeeded()
      .then(() => {
        const container = mapRef.current;
        if (!container) return;
        const DEFAULT_CENTER = new window.naver.maps.LatLng(35.8464522, 127.1296552); // 기본(공대 근처)

        const initialCenter = (lat && lng)
          ? new window.naver.maps.LatLng(lat, lng)
          : DEFAULT_CENTER;

        // 지도 생성(초기 중심은 좌표가 있으면 해당 위치, 아니면 공대 근처)
        const map = new window.naver.maps.Map(container, {
          center: initialCenter,
          zoom: 15,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
            style: window.naver.maps.ZoomControlStyle.SMALL
          }
        });

        // 커스텀 마커 HTML
        const markerHTML = `
          <div class="custom-marker">
            <div class="marker-pulse"></div>
            <div class="marker-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#004ca5"/>
              </svg>
            </div>
          </div>
        `;

        // 마커 생성/갱신 + 지도 중심 이동 헬퍼
        const placeMarkerAt = (pos) => {
          if (markerRef.current) markerRef.current.setMap(null);
          markerRef.current = new window.naver.maps.Marker({
            position: pos,
            map: map,
            icon: {
              content: markerHTML,
              anchor: new window.naver.maps.Point(12, 24)
            },
            title: name || '위치',
            zIndex: 1000
          });
          map.panTo(pos, { duration: 500, easing: 'easeOutCubic' });
        };

        if (lat && lng) {
          // 이미 좌표가 있는 경우
          placeMarkerAt(initialCenter);
          mapObjRef.current = map;
          return;
        }

        // 우선순위: (1) 주소만 사용 — 요청에 따라 업체명 폴백 제거
        const tryPlaceByAddressThenName = async () => {
          const addr = normalizeAddress(address, name);

          // 1) 주소가 충분히 구체적이면 주소 우선 검색
          if (addr && addr.replace(/\s/g, '').length >= 5) {
            const geo = await geocodeByAddress(addr);
            if (geo) {
              const pos = new window.naver.maps.LatLng(geo.lat, geo.lng);
              placeMarkerAt(pos);
              mapObjRef.current = map;
              return;
            }
            console.warn('[NAVER] Geocoding 실패:', name, addr);
          }

          // 주소가 없거나 실패 시 기본 중심(공대 근처) 사용
          placeMarkerAt(DEFAULT_CENTER);
          mapObjRef.current = map;
        };

        tryPlaceByAddressThenName();
      })
      .catch((err) => {
        setMapError(err.message || '지도 초기화 오류');
      });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
      mapObjRef.current = null;
    };
  }, [lat, lng, address, name]);

  return (
    <div className="benefits-frame">
      <div className="benefits-frame-inner">
        <div className="benefits-grid">
          {/* 좌측 지도 영역: 동적 로딩 + 주소/좌표 기반 마커 표시 */}
          <div className="benefits-map" ref={mapRef} aria-label="제휴업체 위치 지도">
            {mapError && (
              <div style={{
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#b91c1c', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '12px',
                textAlign: 'center', padding: '1rem'
              }}>
                지도 로드 실패: {mapError}<br/>
                .env에 REACT_APP_NAVER_CLIENT_ID를 설정했는지 확인해 주세요.
              </div>
            )}
          </div>
          {/* 우측 정보 영역 */}
          <div className="benefits-info">
            <h2 className="benefits-title">{name}</h2>
            <div className="benefits-row"><span className="label">주소</span><span className="value">{address}</span></div>
            <div className="benefits-row"><span className="label">연락처</span><a className="value" href={`tel:${phone}`}>{phone}</a></div>
            <div className="benefits-divider" />
            <div className="benefits-subtitle">제휴 혜택</div>
            <ul className="benefits-perks">
              {benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenefitsList = () => {
    return (
    <div className="benefits-list">
      {partners.map((p, idx) => (
        <BenefitsPartner key={idx} {...p} />
      ))}
    </div>
  );
};

export default BenefitsList; 