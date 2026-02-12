import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">페이지를 찾을 수 없습니다</h1>
        <p className="not-found-desc">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="not-found-actions">
          <button type="button" className="not-found-btn-primary" onClick={() => navigate('/')}>
            홈으로 이동
          </button>
          <button type="button" className="not-found-btn-secondary" onClick={() => navigate(-1)}>
            이전 페이지
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
