import React, { useEffect, useRef, useState, useMemo } from 'react';
import './benefits.css';
import { partners, categories } from './partnersData.js';

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

// 전체 제휴업체를 한 지도에 표시하는 컴포넌트
const BenefitsMapView = ({ filteredPartners = partners }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const initializedRef = useRef(false);

  // 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    loadNaverIfNeeded()
      .then(() => {
        const container = mapRef.current;
        if (!container) return;

        const DEFAULT_CENTER = new window.naver.maps.LatLng(35.8464522, 127.1296552);

        // 지도 생성
        const map = new window.naver.maps.Map(container, {
          center: DEFAULT_CENTER,
          zoom: 14,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
            style: window.naver.maps.ZoomControlStyle.SMALL
          }
        });

        mapInstanceRef.current = map;
        setIsLoading(false);
      })
      .catch((err) => {
        setMapError(err.message || '지도 초기화 오류');
        setIsLoading(false);
      });

    return () => {
      mapInstanceRef.current = null;
    };
  }, []);

  // 마커 업데이트 (filteredPartners가 변경될 때마다 실행)
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading) return;

    const map = mapInstanceRef.current;
    const DEFAULT_CENTER = new window.naver.maps.LatLng(35.8464522, 127.1296552);

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    setSelectedPartner(null);

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

    // 필터링된 업체의 좌표를 가져와서 마커 표시
    const loadAllMarkers = async () => {
      const validPartners = [];
      const positions = [];

      // 필터링된 업체의 좌표 가져오기
      for (const partner of filteredPartners) {
        let position = null;

        if (partner.lat && partner.lng) {
          position = new window.naver.maps.LatLng(partner.lat, partner.lng);
        } else if (partner.address) {
          const addr = normalizeAddress(partner.address, partner.name);
          if (addr && addr.replace(/\s/g, '').length >= 5) {
            const geo = await geocodeByAddress(addr);
            if (geo) {
              position = new window.naver.maps.LatLng(geo.lat, geo.lng);
            }
          }
        }

        if (position) {
          validPartners.push({ ...partner, position });
          positions.push(position);
        }
      }

      // 마커 생성
      validPartners.forEach((partner) => {
        const marker = new window.naver.maps.Marker({
          position: partner.position,
          map: map,
          icon: {
            content: markerHTML,
            anchor: new window.naver.maps.Point(12, 24)
          },
          title: partner.name || '위치',
          zIndex: 1000
        });

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedPartner(partner);
        });

        markersRef.current.push(marker);
      });

      // 모든 마커를 포함하도록 지도 범위 조정
      if (positions.length > 0) {
        const bounds = new window.naver.maps.LatLngBounds();
        positions.forEach(pos => bounds.extend(pos));
        map.fitBounds(bounds, { padding: 80 });
      } else {
        // 마커가 없으면 기본 중심 사용
        map.setCenter(DEFAULT_CENTER);
      }
    };

    loadAllMarkers();
  }, [filteredPartners, isLoading]);

  return (
    <div className="benefits-map-view">
      <div className="benefits-map-container" ref={mapRef} style={{ width: '100%', height: '600px', minHeight: '500px' }}>
        {isLoading && (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f9fafb', borderRadius: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>지도를 불러오는 중...</p>
            </div>
          </div>
        )}
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

      {/* 선택된 업체 정보 표시 */}
      {selectedPartner && (
        <div className="benefits-map-info" style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
            <h3 style={{ margin: 0, color: '#004ca5' }}>{selectedPartner.name}</h3>
            <button
              onClick={() => setSelectedPartner(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0',
                lineHeight: '1'
              }}
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>주소:</strong> {selectedPartner.address}
          </div>
          {selectedPartner.phone && (
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>연락처:</strong> <a href={`tel:${selectedPartner.phone}`}>{selectedPartner.phone}</a>
            </div>
          )}
          {selectedPartner.benefits && selectedPartner.benefits.length > 0 && (
            <div>
              <strong>제휴 혜택:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
                {selectedPartner.benefits.map((b, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{b}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BenefitsList = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 카테고리 필터링
  const filteredPartners = useMemo(() => {
    if (selectedCategory === '전체') {
      return partners;
    }
    return partners.filter(p => p && p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="benefits-page">
      {/* 카테고리 탭 */}
      <div className="benefits-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`benefits-category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            aria-label={`${cat} 카테고리`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 뷰 모드 전환 버튼 */}
      <div className="benefits-view-toggle">
        <button
          onClick={() => setViewMode('list')}
          className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
        >
          목록 보기
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
        >
          지도 보기
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="benefits-list">
          {filteredPartners.map((p, idx) => (
            <BenefitsPartner key={idx} {...p} />
          ))}
        </div>
      ) : (
        <div className="benefits-map-wrapper">
          <BenefitsMapView filteredPartners={filteredPartners} />
        </div>
      )}
    </div>
  );
};

export default BenefitsList; 
