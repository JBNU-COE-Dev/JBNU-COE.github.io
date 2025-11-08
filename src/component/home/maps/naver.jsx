import React, { useEffect, useRef, useState } from 'react';
import './naver.css';

function Naver({ containerStyle, address, name, lat, lng }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    
    if (!CLIENT_ID) {
      setError('네이버 지도 API 키가 설정되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    // 네이버 지도 스크립트가 이미 로드되었는지 확인
    if (window.naver && window.naver.maps) {
      // Service 객체도 확인 (지오코딩 사용 시 필요)
      if (window.naver.maps.Service) {
        initMap();
      } else {
        // Service 객체가 아직 준비되지 않았으면 대기
        const checkServiceReady = () => {
          if (window.naver && window.naver.maps && window.naver.maps.Service) {
            initMap();
          } else {
            setTimeout(checkServiceReady, 100);
          }
        };
        checkServiceReady();
      }
      return;
    }

    // 이미 스크립트를 로드 중이면 중복 로드 방지
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // 네이버 지도 스크립트 동적 로드 (신규 API 사용)
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${CLIENT_ID}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      console.log('Naver Maps SDK loaded');
      // Service 객체가 준비될 때까지 대기
      const checkServiceReady = () => {
        if (window.naver && window.naver.maps && window.naver.maps.Service) {
          initMap();
        } else {
          // Service 객체가 아직 준비되지 않았으면 100ms 후 다시 확인
          setTimeout(checkServiceReady, 100);
        }
      };
      checkServiceReady();
    };

    script.onerror = () => {
      console.error('[NAVER] SDK 스크립트 로드 실패');
      setError('지도 로드에 실패했습니다.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    function initMap() {
      if (!window.naver || !window.naver.maps) {
        console.error('[NAVER] 네이버 지도 API가 로드되지 않았습니다.');
        setError('지도 API를 불러올 수 없습니다.');
        setIsLoading(false);
        return;
      }

      const container = document.getElementById('naver-map');
      if (!container) {
        setIsLoading(false);
        return;
      }

      // 기본 중심 좌표 (전북대 공과대학)
      const defaultCenter = new window.naver.maps.LatLng(35.8464522, 127.1296552);
      
      // 초기 중심 좌표 설정
      const initialCenter = (lat && lng)
        ? new window.naver.maps.LatLng(lat, lng)
        : defaultCenter;

      // 지도 옵션 - 더 fancy한 스타일
      const mapOptions = {
        center: initialCenter,
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
          style: window.naver.maps.ZoomControlStyle.SMALL
        },
        mapDataControl: false,
        scaleControl: false,
        logoControl: true,
        logoControlOptions: {
          position: window.naver.maps.Position.BOTTOM_LEFT
        }
      };

      // 지도 생성
      const map = new window.naver.maps.Map(container, mapOptions);
      mapInstanceRef.current = map;

      // 커스텀 마커 생성 함수
      const createMarker = (position, title = name || '위치') => {
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

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

        markerRef.current = new window.naver.maps.Marker({
          position: position,
          map: map,
          icon: {
            content: markerHTML,
            anchor: new window.naver.maps.Point(12, 24)
          },
          title: title,
          zIndex: 1000
        });

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(markerRef.current, 'click', () => {
          if (name) {
            console.log('마커 클릭:', name);
          }
        });

        // 지도 중심 이동 애니메이션
        map.panTo(position, {
          duration: 500,
          easing: 'easeOutCubic'
        });

        setIsLoading(false);
      };

      // 좌표가 있는 경우
      if (lat && lng) {
        const pos = new window.naver.maps.LatLng(lat, lng);
        createMarker(pos);
        return;
      }

      // 주소가 있는 경우 - 지오코딩
      if (address) {
        // Service 객체 존재 여부 확인
        if (!window.naver.maps.Service) {
          console.warn('[NAVER] Service 객체가 아직 준비되지 않았습니다.');
          createMarker(defaultCenter, '기본 위치');
          return;
        }
        
        window.naver.maps.Service.geocode({
          query: address
        }, (status, response) => {
          if (status === window.naver.maps.Service.Status.ERROR) {
            console.warn('[NAVER] Geocoding 실패:', address);
            createMarker(defaultCenter, '기본 위치');
            return;
          }

          if (response.v2.meta.totalCount === 0) {
            console.warn('[NAVER] 주소를 찾을 수 없습니다:', address);
            createMarker(defaultCenter, '기본 위치');
            return;
          }

          const item = response.v2.addresses[0];
          const position = new window.naver.maps.LatLng(
            parseFloat(item.y),
            parseFloat(item.x)
          );
          createMarker(position);
        });
      } else {
        // 주소도 좌표도 없는 경우 기본 위치
        createMarker(defaultCenter, '기본 위치');
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
      scriptLoadedRef.current = false;
    };
  }, [address, lat, lng, name]);

  return (
    <div className="naver-map-wrapper">
      {isLoading && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>지도를 불러오는 중...</p>
        </div>
      )}
      {error && (
        <div className="map-error">
          <p>{error}</p>
        </div>
      )}
      <div
        id="naver-map"
        className={`naver-map-container ${isLoading ? 'loading' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '420px',
          ...(containerStyle || {}),
        }}
      ></div>
    </div>
  );
}

export default Naver;
