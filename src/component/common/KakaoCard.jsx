import React from 'react';
import { motion } from 'framer-motion';
import { RiKakaoTalkFill } from 'react-icons/ri';
import './KakaoCard.css';

/**
 * 카카오톡 채널/오픈채팅 안내 카드
 *
 * 노란색 카드 안에 아이콘 + 제목 + 설명, 입장 버튼, QR 코드를 표시합니다.
 * 버튼을 누르면 kakaoUrl 을 새 탭으로 엽니다.
 *
 * 카드 자체의 스타일(.kakao-main-card 이하)은 KakaoCard.css 가 담당하며,
 * 카드의 바깥 여백/배치는 사용하는 페이지의 CSS에 맡깁니다.
 *
 * qrImage 를 넘기지 않으면 QR 영역은 렌더링되지 않습니다.
 * (Report.jsx, BoardInquiry.jsx, KakaoChannel.jsx 참고)
 */
export default function KakaoCard({
  kakaoUrl,
  title,
  description,
  buttonText = '카카오톡 채팅방 입장하기',
  qrImage,
  qrAlt = '카카오톡 QR 코드',
  qrText,
  className = '',
}) {
  const handleKakaoClick = () => {
    window.open(kakaoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`kakao-main-card ${className}`.trim()}>
      <div className="kakao-card-info">
        <RiKakaoTalkFill className="kakao-card-icon" />
        <div className="kakao-card-text">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="kakao-card-actions">
        <motion.button
          className="kakao-card-button"
          onClick={handleKakaoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RiKakaoTalkFill className="button-icon" />
          {buttonText}
        </motion.button>

        {qrImage && (
          <div className="kakao-qr-section">
            <div className="kakao-qr-container">
              <img src={qrImage} alt={qrAlt} className="kakao-qr-image" />
              {qrText && <p className="kakao-qr-text">{qrText}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
