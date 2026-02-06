import React from 'react';
import { useNavigate } from 'react-router-dom';
import './cards.css'; // 공통 스타일을 공유해도 좋음
import { FaCompass } from 'react-icons/fa';

function AllianceCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/benefits');
  };

  return (
    <div className="card notice-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <FaCompass size={40} />
      <h2>제휴지도</h2>
      <p className='AllianceCard-text'>공과대학 학생만을 위한 <br/> 제휴 정보를 확인해보세요!</p>
    </div>
  );
}

export default AllianceCard; 