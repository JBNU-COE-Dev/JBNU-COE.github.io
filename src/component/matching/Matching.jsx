import React, { useState } from 'react';
import './Matching.css';

const Matching = () => {
  const [activeTab, setActiveTab] = useState('study'); // 'study', 'project', 'mentor'

  const studyMatches = [
    { id: 1, title: '알고리즘 스터디 모집', category: '컴퓨터공학', members: '3/5', deadline: '2026-01-15' },
    { id: 2, title: '토익 스터디 함께하실 분', category: '공통', members: '2/4', deadline: '2026-01-20' },
    { id: 3, title: '전공 수학 스터디', category: '수학', members: '4/6', deadline: '2026-01-18' },
  ];

  const projectMatches = [
    { id: 1, title: '웹 개발 프로젝트 팀원 모집', category: '프로젝트', members: '2/4', deadline: '2026-01-25' },
    { id: 2, title: '앱 개발 동아리 프로젝트', category: '모바일', members: '3/5', deadline: '2026-02-01' },
  ];

  const mentorMatches = [
    { id: 1, title: '졸업생 선배 멘토링 프로그램', category: '진로상담', members: '5/10', deadline: '2026-01-30' },
    { id: 2, title: '취업 준비 멘토링', category: '취업', members: '8/15', deadline: '2026-02-05' },
  ];

  const getMatches = () => {
    switch(activeTab) {
      case 'study': return studyMatches;
      case 'project': return projectMatches;
      case 'mentor': return mentorMatches;
      default: return [];
    }
  };

  return (
    <div className="matching-container">
      <div className="matching-header">
        <h1 className="matching-title">매칭 플랫폼</h1>
        <p className="matching-subtitle">스터디, 프로젝트, 멘토링을 찾아보세요</p>
      </div>

      <div className="matching-tabs">
        <button 
          className={`matching-tab ${activeTab === 'study' ? 'active' : ''}`}
          onClick={() => setActiveTab('study')}
        >
          스터디
        </button>
        <button 
          className={`matching-tab ${activeTab === 'project' ? 'active' : ''}`}
          onClick={() => setActiveTab('project')}
        >
          프로젝트
        </button>
        <button 
          className={`matching-tab ${activeTab === 'mentor' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentor')}
        >
          멘토링
        </button>
      </div>

      <div className="matching-content">
        <div className="matching-list">
          {getMatches().map((match) => (
            <div key={match.id} className="matching-card">
              <div className="matching-card-header">
                <h3 className="matching-card-title">{match.title}</h3>
                <span className="matching-card-category">{match.category}</span>
              </div>
              <div className="matching-card-body">
                <div className="matching-card-info">
                  <span className="matching-card-members">인원: {match.members}</span>
                  <span className="matching-card-deadline">마감: {match.deadline}</span>
                </div>
                <button className="matching-card-button">자세히 보기</button>
              </div>
            </div>
          ))}
        </div>

        <div className="matching-sidebar">
          <div className="matching-sidebar-card">
            <h3>새 매칭 등록</h3>
            <p>스터디, 프로젝트, 멘토링을 등록하고 팀원을 모집하세요.</p>
            <button className="matching-create-button">등록하기</button>
          </div>
          
          <div className="matching-sidebar-card">
            <h3>인기 매칭</h3>
            <ul className="matching-popular-list">
              <li>알고리즘 스터디 모집</li>
              <li>웹 개발 프로젝트 팀원 모집</li>
              <li>졸업생 선배 멘토링 프로그램</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matching;

