import React, { useState, useEffect } from 'react';
import './pledge.css';
import PledgeList from './PledgeList';
import { pledgeData, calculateOverallRate, calculateCategoryRate } from './pledgeData';
import { getPledgeProgress } from '../../../services/pledgeApi';

function Pledge() {
  // API에서 ID별 completed를 받아 정적 데이터와 매칭한 카테고리
  const [categories, setCategories] = useState(pledgeData.categories);

  useEffect(() => {
    let cancelled = false;
    getPledgeProgress()
      .then((res) => {
        if (cancelled || !res?.progress) return;
        const progress = res.progress;
        setCategories(
          pledgeData.categories.map((cat) => ({
            ...cat,
            pledges: cat.pledges.map((p) => ({
              ...p,
              completed: progress[p.id] === true,
            })),
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setCategories(pledgeData.categories);
      });
    return () => { cancelled = true; };
  }, []);

  const overallPercentage = calculateOverallRate(categories);
  const allPledges = categories.flatMap((cat) => cat.pledges);
  const totalCount = allPledges.length;
  const completedCount = allPledges.filter((p) => p.completed).length;

  return (
    <div className="pledge-page">
      <header className="pledge-header">
        <h1>공약 이행률</h1>
      </header>

      {/* 요약 스트립 */}
      <div className="pledge-summary">
        <div className="summary-rate">
          <span className="summary-label">전체 이행률</span>
          <span className="summary-value">
            {overallPercentage}<span className="unit">%</span>
          </span>
        </div>

        <div className="summary-matrix">
          <div className="matrix-cells">
            {allPledges.map((pledge) => (
              <span
                key={pledge.id}
                className={`matrix-cell ${pledge.completed ? 'done' : ''}`}
                title={`${pledge.title} · ${pledge.completed ? '이행 완료' : '진행 중'}`}
              />
            ))}
          </div>
          <span className="matrix-caption">
            전체 공약 {totalCount}개
          </span>
        </div>

        <div className="summary-stats">
          <div className="pledge-stat">
            <span className="pledge-stat-label">전체</span>
            <span className="pledge-stat-value">{totalCount}</span>
          </div>
          <div className="pledge-stat">
            <span className="pledge-stat-label">이행 완료</span>
            <span className="pledge-stat-value completed">{completedCount}</span>
          </div>
          <div className="pledge-stat">
            <span className="pledge-stat-label">진행 중</span>
            <span className="pledge-stat-value pending">{totalCount - completedCount}</span>
          </div>
        </div>
      </div>

      {/* 분야별 보드 */}
      <div className="pledge-board">
        <div className="board-head">
          <h2>분야별 이행 현황</h2>
          <span className="board-count">{categories.length}개 분야</span>
        </div>

        <div className="pledge-category-grid">
          {categories.map((category) => {
            const categoryPercentage = calculateCategoryRate(category.pledges);
            const categoryCompleted = category.pledges.filter((p) => p.completed).length;

            return (
              <section key={category.id} className="pledge-category-card">
                <header className="pledge-category-head">
                  <div className="pledge-category-title-row">
                    <h3>{category.title}</h3>
                    <span className="pledge-category-count">
                      {categoryCompleted} / {category.pledges.length}
                    </span>
                  </div>
                  <div className="pledge-category-rate">
                    <span className="pledge-category-percentage">
                      {categoryPercentage}<span className="unit">%</span>
                    </span>
                    <div className="pledge-category-bar">
                      <div
                        className="pledge-category-bar-fill"
                        style={{ width: `${categoryPercentage}%` }}
                      />
                    </div>
                  </div>
                </header>

                <PledgeList pledges={category.pledges} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Pledge;
