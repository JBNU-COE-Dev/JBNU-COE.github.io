import React, { useEffect, useMemo, useRef, useState } from 'react';
import Naver from '../maps/naver.jsx';
import { partners } from '../../benefits/partnersData.js';
import './PartnerShowcase.css';

// 단순 셔플(Fisher–Yates)
function shuffleArray(input) {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const AUTO_INTERVAL_MS = 5000;

export default function PartnerShowcase({ query = '' }) {
  const items = useMemo(() => shuffleArray(partners).filter(p => p && p.name && p.address), []);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const current = items.length ? items[index % items.length] : null;

  useEffect(() => {
    if (!items.length) return undefined;
    if (isPaused) return undefined;
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length);
    }, AUTO_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, isPaused]);

  // 검색어가 변경되면 자동으로 해당 업체로 점프 (이름/주소/혜택 텍스트 포함 검색)
  useEffect(() => {
    const q = String(query || '').trim();
    if (!q) { setIsPaused(false); return; }
    const lower = q.toLowerCase();
    setIsPaused(true);
    const foundIdx = items.findIndex(p => {
      const hay = [p.name, p.address, p.phone, ...(p.benefits || [])].join(' ').toLowerCase();
      return hay.includes(lower);
    });
    if (foundIdx >= 0) setIndex(foundIdx);
  }, [query, items]);

  const goPrev = () => setIndex(prev => (prev - 1 + items.length) % items.length);
  const goNext = () => setIndex(prev => (prev + 1) % items.length);

  if (!current) {
    return (
      <div className="benefit-body">
        <div className="benefit-map" />
        <div className="benefit-info">불러올 제휴 업체가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="benefit-body">
      <div className="benefit-map" aria-label="제휴업체 위치 지도">
        <Naver address={current.address} name={current.name} lat={current.lat} lng={current.lng} containerStyle={{ minHeight: '360px' }} />
      </div>
      <div className="benefit-info">
        <div className="benefit-nav">
          <button onClick={goPrev} aria-label="이전 업체" className="nav-btn">◀</button>
          <h2 className="benefit-name">{current.name}</h2>
          <button onClick={goNext} aria-label="다음 업체" className="nav-btn">▶</button>
        </div>

        <div className="benefit-details">
          <div className="benefit-row"><span className="label">주소</span><span className="value">{current.address}</span></div>
          <div className="benefit-row"><span className="label">연락처</span><a className="value" href={`tel:${current.phone}`}>{current.phone}</a></div>
          <div className="benefit-row" style={{ alignItems: 'start' }}>
            <span className="label">제휴내용</span>
            <span className="value">
              {(current.benefits && current.benefits.length)
                ? (
                  <div style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {current.benefits.map((b, i) => (<div key={i}>{b}</div>))}
                  </div>
                )
                : '정보 없음'}
            </span>
          </div>
        </div>

        <div className="benefit-indicators" aria-label="슬라이드 인디케이터">
          {items.slice(0, 12).map((_, i) => (
            <span key={i} className={`benefit-dot ${i === (index % items.length) ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}


