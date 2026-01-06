import React from 'react';
import { Link } from 'react-router-dom';
import './topBar.css';

function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-right">
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
