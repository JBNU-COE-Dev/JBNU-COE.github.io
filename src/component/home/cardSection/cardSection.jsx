import React from 'react';
import NoticeCard from './cards/noticeCard.jsx';
import AllianceCard from './cards/allianceCard.jsx';
import ReportCard from './cards/reportCard.jsx';
import './cardSection.css';


function CardSection({ isMobile, isTablet, isDesktop }) {
  // const { isMobile, isTablet, isDesktop } = useResponsive();

  // 카드 배열
  const cards = [
    <div className="card1" key="1"><NoticeCard /></div>,
    <div className="card2" key="2"><AllianceCard /></div>,
    <div className="card4" key="4"><ReportCard /></div>
  ];

  // 조건에 따라 보여줄 카드 수 조정
  let displayedCards = cards;

  return (
    <div className="card-section">
      {displayedCards}
    </div>
  );
}

export default CardSection; 