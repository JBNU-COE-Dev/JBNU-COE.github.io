import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './topBar.css';

function TopBar() {
  const { isAuthenticated, userEmail, logout } = useAuth();

  return (
    <div className="top-bar">
      <div className="top-bar-right">
        {isAuthenticated ? (
          <>
            <span className="top-bar-user">{userEmail}</span>
            <span className="top-bar-divider">|</span>
            <button type="button" className="top-bar-btn" onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="top-bar-link">로그인</Link>
            <span className="top-bar-divider">|</span>
            <Link to="/login" className="top-bar-link">회원가입</Link>
            <span className="top-bar-divider">|</span>
          </>
        )}
        <Link to="/contact/report" className="top-bar-link">민원접수</Link>
        <span className="top-bar-divider">|</span>
        <a
          href="https://www.jbnu.ac.kr"
          target="_blank"
          rel="noopener noreferrer"
          className="top-bar-link"
        >
          전북대학교
        </a>
      </div>
    </div>
  );
}

export default TopBar;
