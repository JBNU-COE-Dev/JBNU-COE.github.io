import React from 'react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { useResponsive } from '../hooks/useResponsive.jsx';
import './KakaoCard.css';

/**
 * 카카오톡 채널/오픈채팅 안내 카드
 *
 * 사이트의 카드 규격(흰 배경 / 1px 테두리 / radius 12px)을 따르고,
 * 카카오 브랜드 옐로우는 아이콘 칩과 입장 버튼에만 씁니다.
 *
 * 카드 자체의 스타일(.kakao-card 이하)은 KakaoCard.css 가 담당하며,
 * 카드의 바깥 여백/배치는 사용하는 페이지의 CSS에 맡깁니다.
 *
 * qrImage 를 넘기지 않으면 QR 영역은 렌더링되지 않습니다.
 * 좁은 화면에서는 QR 을 접어둡니다 — 같은 기기로는 찍을 수 없기 때문입니다.
 * (Report.jsx, BoardInquiry.jsx, KakaoChannel.jsx 참고)
 */
export default function KakaoCard({
  kakaoUrl,
  title,
  description,
  buttonText = '카카오톡 채팅방 입장하기',
  qrImage,
  qrAlt = '카카오톡 QR 코드',
  qrText = 'QR로 바로 입장',
  className = '',
}) {
  const { isMobile } = useResponsive();

  const qr = qrImage ? (
    <div className="kakao-card-qr">
      <img src={qrImage} alt={qrAlt} className="kakao-card-qr-image" />
      {qrText && <span className="kakao-card-qr-text">{qrText}</span>}
    </div>
  ) : null;

  return (
    <div className={`kakao-card ${className}`.trim()}>
      <div className="kakao-card-head">
        <span className="kakao-card-badge" aria-hidden="true">
          <RiKakaoTalkFill />
        </span>
        <div className="kakao-card-text">
          <p className="kakao-card-title">{title}</p>
          {description && <p className="kakao-card-description">{description}</p>}
        </div>
      </div>

      <a
        className="kakao-card-button"
        href={kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiKakaoTalkFill className="kakao-card-button-icon" aria-hidden="true" />
        {buttonText}
      </a>

      {qr && (isMobile ? (
        <details className="kakao-card-qr-toggle">
          <summary>
            QR 코드로 입장
            <svg
              className="kakao-card-qr-chevron"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          {qr}
        </details>
      ) : qr)}
    </div>
  );
}
