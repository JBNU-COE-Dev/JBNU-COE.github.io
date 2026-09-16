import React, { useState } from 'react';
import './buildingMap.css';

const BUILDINGS = [
  { id: 1, name: '1호관', floors: [1, 2, 3] },
  { id: 2, name: '2호관', floors: [1, 2, 3, 4] },
  { id: 3, name: '3호관', floors: [1, 2, 3, 4] },
  { id: 4, name: '4호관', floors: [-1, 1, 2, 3, 4] },
  { id: 5, name: '5호관', floors: [1, 2, 3, 4, 5] },
  { id: 6, name: '6호관', floors: [-1, 1, 2, 3, 4, 5] },
  { id: 7, name: '7호관', floors: [-1, 1, 2, 3, 4, 5, 6] },
  { id: 8, name: '8호관', floors: [1, 2, 3, 4] },
  { id: 9, name: '9호관', floors: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
];

function formatFloor(f) {
  if (f < 0) return `지하 ${Math.abs(f)}층`;
  return `${f}층`;
}

export default function BuildingMap() {
  // 최초 렌더링 시 1호관 1층을 기본값으로 설정
  const defaultBuilding = BUILDINGS.find(b => b.id === 1) || BUILDINGS[0];
  const [selectedBuilding, setSelectedBuilding] = useState(defaultBuilding);
  const [selectedFloor, setSelectedFloor] = useState(1);

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    // 기본값: 1층이 있으면 1층, 없으면 첫 번째 층
    const defaultFloor = building.floors.includes(1) ? 1 : building.floors[0];
    setSelectedFloor(defaultFloor);
  };

  const handleFloorClick = (floor) => {
    setSelectedFloor(floor);
  };

  const getMapImage = () => {
    if (!selectedBuilding || selectedFloor === null) return null;
    // PUBLIC_URL 고려 (GitHub Pages 등)
    const base = process.env.PUBLIC_URL || '';
    return `${base}/maps/${selectedBuilding.id}/${selectedFloor}.jpg`;
  };

  return (
    <div className="building-map-page">
      <h1 className="map-title">공과대학 내부 지도</h1>

      {/* 건물 선택 그리드 */}
      <div className="building-grid">
        {BUILDINGS.map(b => (
          <button
            key={b.id}
            onClick={() => handleBuildingClick(b)}
            className={`building-btn ${selectedBuilding?.id === b.id ? 'active' : ''}`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* 층 선택 (건물 선택 후 표시) */}
      {selectedBuilding && (
        <div className="floor-section">
          <h2 className="floor-title">{selectedBuilding.name} - 층 선택</h2>
          <div className="floor-grid">
            {selectedBuilding.floors.map(f => (
              <button
                key={f}
                onClick={() => handleFloorClick(f)}
                className={`floor-btn ${selectedFloor === f ? 'active' : ''}`}
              >
                {formatFloor(f)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 지도 표시 영역 */}
      {selectedFloor !== null && (
        <div className="map-display">
          <h3 className="map-display-title">
            {selectedBuilding.name} {formatFloor(selectedFloor)} 평면도
          </h3>
          <div className="map-image-wrapper">
            <img
              src={getMapImage()}
              alt={`${selectedBuilding.name} ${formatFloor(selectedFloor)} 지도`}
              className="map-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="map-placeholder" style={{ display: 'none' }}>
              <p>지도 이미지를 준비 중입니다.</p>
              <small>경로: {getMapImage()}</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

