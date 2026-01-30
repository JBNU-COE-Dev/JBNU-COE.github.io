import React from 'react';
import './pledge.css';
import CircularProgress from './CircularProgress';
import PledgeList from './PledgeList';
import { pledgeData, calculateOverallRate, calculateCategoryRate } from './pledgeData';

function Pledge() {
  // 전체 이행률 계산
  const overallPercentage = calculateOverallRate(pledgeData.categories);

  return (
    <div className="pledge-container">
      <div className="pledge-header">
        <h1>공약 이행률</h1>
        <p>제58대 공과대학 학생회 '심(心)'의 공약 이행 현황을 확인해보세요</p>
      </div>

      <div className="pledge-content">
        {/* 전체 공약 이행률 */}
        <div className="overall-progress-section">
          <h2>전체 공약 이행률</h2>
          <div className="overall-progress-container">
            <CircularProgress
              percentage={overallPercentage}
              color="#004ca5"
              size={200}
              strokeWidth={15}
            />
            <div className="overall-progress-text">
              <span className="percentage">{overallPercentage}%</span>
              <span className="description">전체 공약 이행률</span>
            </div>
          </div>
          <div className="overall-stats">
            <div className="stat-item">
              <span className="stat-label">전체 공약</span>
              <span className="stat-value">
                {pledgeData.categories.reduce((sum, cat) => sum + cat.pledges.length, 0)}개
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">이행 완료</span>
              <span className="stat-value completed">
                {pledgeData.categories.reduce((sum, cat) =>
                  sum + cat.pledges.filter(p => p.completed).length, 0
                )}개
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">진행 중</span>
              <span className="stat-value pending">
                {pledgeData.categories.reduce((sum, cat) =>
                  sum + cat.pledges.filter(p => !p.completed).length, 0
                )}개
              </span>
            </div>
          </div>
        </div>

        {/* 분야별 공약 이행률 */}
        <div className="category-progress-section">
          <h2>분야별 공약 이행률</h2>
          <div className="category-grid">
            {pledgeData.categories.map((category) => {
              const categoryPercentage = calculateCategoryRate(category.pledges);
              const completedCount = category.pledges.filter(p => p.completed).length;
              const totalCount = category.pledges.length;

              return (
                <div key={category.id} className="category-card">
                  <div className="category-header">
                    <CircularProgress
                      percentage={categoryPercentage}
                      color={category.color}
                      size={280}
                      strokeWidth={20}
                    />
                    <div className="category-info">
                      <h3>{category.title}</h3>
                      <span className="category-percentage">{categoryPercentage}%</span>
                      <span className="category-count">
                        {completedCount} / {totalCount} 완료
                      </span>
                    </div>
                  </div>
                  <div className="category-content">
                    <PledgeList pledges={category.pledges} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pledge;
