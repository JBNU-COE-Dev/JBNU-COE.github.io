import React, { useEffect, useRef, useState, useMemo } from 'react';
import './benefits.css';
import { partners, categories } from './partnersData.js';

// 카테고리별 아이콘
const categoryIcons = {
  '음식점': '🍽️',
  '카페': '☕',
  '여가': '🎮',
  '기타': '📦',
  '전체': '📋'
};

// 네이버 지도 SDK 로드
const loadNaverIfNeeded = () => {
  return new Promise((resolve, reject) => {
    const key = process.env.REACT_APP_NAVER_CLIENT_ID;
    if (!key) {
      console.warn('[NAVER] REACT_APP_NAVER_CLIENT_ID가 설정되지 않았습니다.');
      return resolve();
    }
    if (window.naver && window.naver.maps) {
      if (window.naver.maps.Service) {
        resolve();
      } else {
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
      const checkServiceReady = () => {
        if (window.naver && window.naver.maps && window.naver.maps.Service) {
          resolve();
        } else {
          setTimeout(checkServiceReady, 100);
        }
      };
      checkServiceReady();
    };
    script.onerror = () => reject(new Error('Naver SDK load failed'));
    document.head.appendChild(script);
  });
};

// 주소 정규화
const normalizeAddress = (raw, name) => {
  if (!raw) return '';
  let out = String(raw).trim();
  if (name) {
    const reTailName = new RegExp(`\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'u');
    out = out.replace(reTailName, '').trim();
  }
  out = out.replace(/[.]{2,}/g, '.').replace(/\s{2,}/g, ' ').replace(/\s*[.,]\s*/g, ' ');
  const hasCity = /전주|전북|특별자치|덕진구/.test(out);
  if (!hasCity) out = `전북특별자치도 전주시 덕진구 ${out}`;
  return out.trim();
};

// 지오코딩 캐시
const GEO_CACHE_STORAGE_KEY = 'feel_geo_cache_v1';
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

// 지오코딩
const geocodeByAddress = async (addr) => {
  const key = `addr:${addr}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  return new Promise((resolve) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      resolve(null);
      return;
    }
    window.naver.maps.Service.geocode({ query: addr }, (status, response) => {
      if (status === window.naver.maps.Service.Status.ERROR || response.v2.meta.totalCount === 0) {
        resolve(null);
        return;
      }
      const item = response.v2.addresses[0];
      const out = { lat: parseFloat(item.y), lng: parseFloat(item.x) };
      cacheSet(key, out);
      resolve(out);
    });
  });
};

// 카드 컴포넌트
const BenefitCard = ({ partner, onViewDetail }) => {
  const icon = categoryIcons[partner.category] || '📦';
  const briefBenefit = partner.benefits && partner.benefits.length > 0
    ? partner.benefits[0]
    : '혜택 정보 없음';

  return (
    <div className="benefit-card">
      <div className="benefit-card-icon">{icon}</div>
      <div className="benefit-card-content">
        <h3 className="benefit-card-name">{partner.name}</h3>
        <p className="benefit-card-brief">{briefBenefit}</p>
        <span className="benefit-card-category">{partner.category}</span>
      </div>
      <button
        className="benefit-card-btn"
        onClick={() => onViewDetail(partner)}
      >
        혜택보기
      </button>
    </div>
  );
};

// 모달 컴포넌트
const BenefitModal = ({ partner, onClose, onViewMap }) => {
  if (!partner) return null;

  const icon = categoryIcons[partner.category] || '📦';

  // 길찾기 (네이버 지도 앱/웹)
  const handleDirection = () => {
    const query = encodeURIComponent(partner.address || partner.name);
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
  };

  return (
    <div className="benefit-modal-overlay" onClick={onClose}>
      <div className="benefit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="benefit-modal-header">
          <h2>{partner.name}</h2>
          <button className="benefit-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="benefit-modal-body">
          <div className="benefit-modal-icon">{icon}</div>

          <div className="benefit-modal-info">
            <div className="benefit-modal-row">
              <span className="label">주소</span>
              <span className="value">{partner.address}</span>
            </div>
            {partner.phone && (
              <div className="benefit-modal-row">
                <span className="label">연락처</span>
                <a className="value" href={`tel:${partner.phone}`}>{partner.phone}</a>
              </div>
            )}
          </div>

          <div className="benefit-modal-section">
            <h3>제휴 혜택</h3>
            <ul className="benefit-modal-list">
              {partner.benefits && partner.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="benefit-modal-footer">
          <button className="benefit-modal-btn secondary" onClick={handleDirection}>
            길찾기
          </button>
          <button className="benefit-modal-btn primary" onClick={() => onViewMap(partner)}>
            위치 확인하기
          </button>
        </div>
      </div>
    </div>
  );
};

// 지도 뷰 컴포넌트
const BenefitMapView = ({ partner, onBack }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!partner) return;

    loadNaverIfNeeded()
      .then(async () => {
        const container = mapRef.current;
        if (!container) return;

        const DEFAULT_CENTER = new window.naver.maps.LatLng(35.8464522, 127.1296552);
        let position = DEFAULT_CENTER;

        // 좌표 가져오기
        if (partner.lat && partner.lng) {
          position = new window.naver.maps.LatLng(partner.lat, partner.lng);
        } else if (partner.address) {
          const addr = normalizeAddress(partner.address, partner.name);
          const geo = await geocodeByAddress(addr);
          if (geo) {
            position = new window.naver.maps.LatLng(geo.lat, geo.lng);
          }
        }

        // 지도 생성
        const map = new window.naver.maps.Map(container, {
          center: position,
          zoom: 16,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
            style: window.naver.maps.ZoomControlStyle.SMALL
          }
        });

        // 마커 생성
        const markerHTML = `
          <div class="custom-marker">
            <div class="marker-pulse"></div>
            <div class="marker-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#004ca5"/>
              </svg>
            </div>
          </div>
        `;

        markerRef.current = new window.naver.maps.Marker({
          position: position,
          map: map,
          icon: {
            content: markerHTML,
            anchor: new window.naver.maps.Point(12, 24)
          },
          title: partner.name
        });

        mapInstanceRef.current = map;
        setIsLoading(false);
      })
      .catch((err) => {
        setMapError(err.message || '지도 로드 실패');
        setIsLoading(false);
      });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
      mapInstanceRef.current = null;
    };
  }, [partner]);

  // 길찾기
  const handleDirection = () => {
    const query = encodeURIComponent(partner.address || partner.name);
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
  };

  return (
    <div className="benefit-map-page">
      <div className="benefit-map-header">
        <button className="benefit-map-back" onClick={onBack}>
          ← 목록으로
        </button>
        <h2>{partner.name}</h2>
      </div>

      <div className="benefit-map-container" ref={mapRef}>
        {isLoading && (
          <div className="benefit-map-loading">
            <div className="loading-spinner"></div>
            <p>지도를 불러오는 중...</p>
          </div>
        )}
        {mapError && (
          <div className="benefit-map-error">
            지도 로드 실패: {mapError}
          </div>
        )}
      </div>

      <div className="benefit-map-info">
        <h3>{partner.name}</h3>
        <p className="benefit-map-address">{partner.address}</p>
        <div className="benefit-map-actions">
          {partner.phone && (
            <a href={`tel:${partner.phone}`} className="benefit-map-btn">
              📞 전화걸기
            </a>
          )}
          <button className="benefit-map-btn primary" onClick={handleDirection}>
            🗺️ 길찾기
          </button>
        </div>
      </div>
    </div>
  );
};

// 메인 컴포넌트
const Benefits = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [modalPartner, setModalPartner] = useState(null);
  const [mapPartner, setMapPartner] = useState(null);

  // 카테고리 필터링
  const filteredPartners = useMemo(() => {
    if (selectedCategory === '전체') {
      return partners;
    }
    return partners.filter(p => p && p.category === selectedCategory);
  }, [selectedCategory]);

  // 모달 열기
  const handleViewDetail = (partner) => {
    setModalPartner(partner);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalPartner(null);
  };

  // 지도 보기
  const handleViewMap = (partner) => {
    setModalPartner(null);
    setMapPartner(partner);
  };

  // 지도에서 목록으로 돌아가기
  const handleBackToList = () => {
    setMapPartner(null);
  };

  // 지도 뷰 모드
  if (mapPartner) {
    return <BenefitMapView partner={mapPartner} onBack={handleBackToList} />;
  }

  return (
    <div className="benefits-page">
      {/* 카테고리 탭 */}
      <div className="benefits-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`benefits-category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {categoryIcons[cat]} {cat}
          </button>
        ))}
      </div>

      {/* 업체 수 표시 */}
      <div className="benefits-count">
        총 <strong>{filteredPartners.length}</strong>개 업체
      </div>

      {/* 카드 리스트 */}
      <div className="benefits-list">
        {filteredPartners.map((partner, idx) => (
          <BenefitCard
            key={idx}
            partner={partner}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>

      {/* 모달 */}
      {modalPartner && (
        <BenefitModal
          partner={modalPartner}
          onClose={handleCloseModal}
          onViewMap={handleViewMap}
        />
      )}
    </div>
  );
};

export default Benefits;
