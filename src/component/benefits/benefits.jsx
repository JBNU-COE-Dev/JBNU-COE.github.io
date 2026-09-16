import React, { useEffect, useRef, useState, useMemo } from 'react';
import './benefits.css';
import { partners, categories } from './partnersData.js';

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

// 카드/목록용 짧은 주소 ('덕진구' 앞부분을 잘라낸다)
const shortAddress = (raw) => {
  if (!raw) return '';
  const trimmed = String(raw).replace(/^.*?덕진구\s*/, '');
  return trimmed || raw;
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

// 카드 컴포넌트 — 카드 전체가 클릭 영역
const BenefitCard = ({ partner, onSelect }) => {
  return (
    <article
      className="benefit-card"
      onClick={() => onSelect(partner)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(partner);
        }
      }}
    >
      <div className="benefit-card-head">
        <span className="benefit-card-category">{partner.category}</span>
        <h3 className="benefit-card-name t1">{partner.name}</h3>
      </div>
      <ul className="benefit-card-benefits">
        {(partner.benefits && partner.benefits.length > 0 ? partner.benefits : ['혜택 정보 없음']).map((b, i) => (
          <li key={i}>
            <span className="benefit-card-dot" />
            <span className="t2">{b}</span>
          </li>
        ))}
      </ul>
      <div className="benefit-card-footer">
        <span className="benefit-card-address t1">{shortAddress(partner.address)}</span>
        <span className="benefit-card-phone">{partner.phone}</span>
      </div>
    </article>
  );
};

// 상세 — 모달(데스크톱) / 바텀시트(모바일), 혜택 → 지도 → 주소·연락처 → 버튼
const BenefitDetail = ({ partner, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapStatus, setMapStatus] = useState('loading'); // loading | ready | unavailable

  useEffect(() => {
    if (!partner) return;
    let cancelled = false;
    setMapStatus('loading');

    const key = process.env.REACT_APP_NAVER_CLIENT_ID;
    if (!key) {
      setMapStatus('unavailable');
      return;
    }

    loadNaverIfNeeded()
      .then(async () => {
        if (cancelled) return;
        const container = mapRef.current;
        if (!container) return;

        let position = null;
        if (partner.lat && partner.lng) {
          position = new window.naver.maps.LatLng(partner.lat, partner.lng);
        } else if (partner.address) {
          const addr = normalizeAddress(partner.address, partner.name);
          const geo = await geocodeByAddress(addr);
          if (geo) position = new window.naver.maps.LatLng(geo.lat, geo.lng);
        }

        if (cancelled) return;
        if (!position) {
          setMapStatus('unavailable');
          return;
        }

        const map = new window.naver.maps.Map(container, {
          center: position,
          zoom: 16,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
            style: window.naver.maps.ZoomControlStyle.SMALL,
          },
        });

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
          position,
          map,
          icon: {
            content: markerHTML,
            anchor: new window.naver.maps.Point(12, 24),
          },
          title: partner.name,
        });

        mapInstanceRef.current = map;
        setMapStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setMapStatus('unavailable');
      });

    return () => {
      cancelled = true;
      if (markerRef.current) markerRef.current.setMap(null);
      mapInstanceRef.current = null;
    };
  }, [partner]);

  if (!partner) return null;

  const handleDirection = () => {
    const query = encodeURIComponent(partner.address || partner.name);
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
  };

  return (
    <div className="benefit-detail-overlay" onClick={onClose}>
      <div className="benefit-detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="benefit-detail-handle" />

        <header className="benefit-detail-header">
          <div className="benefit-detail-heading">
            <span className="benefit-detail-category">{partner.category}</span>
            <h2 className="benefit-detail-name">{partner.name}</h2>
          </div>
          <button type="button" className="benefit-detail-close" onClick={onClose} aria-label="닫기">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="benefit-detail-section">
          <span className="benefit-detail-label">제휴 혜택</span>
          <ul className="benefit-detail-benefits">
            {(partner.benefits && partner.benefits.length > 0 ? partner.benefits : ['혜택 정보 없음']).map((b, i) => (
              <li key={i}>
                <span className="benefit-detail-dot" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="benefit-detail-section benefit-detail-section--map">
          <span className="benefit-detail-label">위치</span>
          <div className="benefit-detail-map" ref={mapRef}>
            {mapStatus === 'loading' && (
              <div className="benefit-detail-map-status">
                <div className="loading-spinner" />
                <p>지도를 불러오는 중...</p>
              </div>
            )}
            {mapStatus === 'unavailable' && (
              <div className="benefit-detail-map-status">
                <p>위치를 불러올 수 없습니다</p>
              </div>
            )}
          </div>
          <div className="benefit-detail-info">
            <div className="benefit-detail-info-row">
              <span className="label">주소</span>
              <span className="value">{partner.address}</span>
            </div>
            {partner.phone && (
              <div className="benefit-detail-info-row">
                <span className="label">연락처</span>
                <a className="value" href={`tel:${partner.phone}`}>{partner.phone}</a>
              </div>
            )}
          </div>
        </div>

        <div className="benefit-detail-actions">
          {partner.phone && (
            <a href={`tel:${partner.phone}`} className="benefit-detail-btn secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3z" />
              </svg>
              전화걸기
            </a>
          )}
          <button type="button" className="benefit-detail-btn primary" onClick={handleDirection}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            길찾기
          </button>
        </div>
      </div>
    </div>
  );
};

// 메인 컴포넌트
const Benefits = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);

  // 브라우저 뒤로가기로 상세 닫기
  useEffect(() => {
    const handlePopState = () => {
      setSelectedPartner(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 분류별 개수
  const categoryCounts = useMemo(() => {
    const counts = { 전체: partners.length };
    for (const cat of categories) {
      if (cat === '전체') continue;
      counts[cat] = partners.filter((p) => p && p.category === cat).length;
    }
    return counts;
  }, []);

  // 분류 + 검색 필터링
  const filteredPartners = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return partners.filter((p) => {
      if (!p) return false;
      if (selectedCategory !== '전체' && p.category !== selectedCategory) return false;
      if (!term) return true;
      const haystack = [p.name, ...(p.benefits || [])].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [selectedCategory, searchTerm]);

  const handleSelect = (partner) => {
    window.history.pushState({ view: 'detail' }, '');
    setSelectedPartner(partner);
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
    <div className="benefits-page">
      <header className="benefits-header">
        <div className="benefits-header-text">
          <h1 className="benefits-title">제휴업체</h1>
        </div>
        <form
          className="benefits-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="benefits-search-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="benefits-search-icon">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="text"
              className="benefits-search-input"
              placeholder="업체명 또는 혜택 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="benefits-search-btn">검색</button>
        </form>
      </header>

      <div className="benefits-body">
        <nav className="benefits-category-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`benefits-category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              <span className="benefits-category-count">{categoryCounts[cat] ?? 0}</span>
            </button>
          ))}
        </nav>

        <section className="benefits-content">
          <div className="benefits-content-head">
            <div className="benefits-content-title">
              <h2>{selectedCategory === '전체' ? '전체 업체' : selectedCategory}</h2>
              <span>{filteredPartners.length}</span>
            </div>
            <span className="benefits-content-hint">업체를 선택하면 전체 혜택과 위치를 볼 수 있습니다</span>
          </div>

          {filteredPartners.length === 0 ? (
            <p className="benefits-empty">검색 결과가 없습니다</p>
          ) : (
            <div className="benefits-grid">
              {filteredPartners.map((partner, idx) => (
                <BenefitCard key={idx} partner={partner} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedPartner && (
        <BenefitDetail partner={selectedPartner} onClose={handleClose} />
      )}
    </div>
  );
};

export default Benefits;
