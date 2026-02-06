import React from 'react';
import { motion } from 'framer-motion';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaComments } from 'react-icons/fa';
import './Report.css';
import kakaoQR from '../../../img/qr-code/kakaoQR.png';

const Report = () => {
  const kakaoUrl = 'https://open.kakao.com/o/suMsRU8h';

  const handleKakaoClick = () => {
    window.open(kakaoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="report-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaComments className="report-main-icon" />
        </motion.div>
        <h1>민원 접수</h1>
        <p>공과대학 학생회에 건의하실 사항이나 문의하실 내용이 있으신가요?</p>
      </div>

      <motion.div
        className="report-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="report-info-box">
          <h2>📢 민원 접수 안내</h2>
          <ul className="report-info-list">
            <li>학생회에 건의사항이나 문의사항이 있으시면 언제든지 연락해주세요.</li>
            <li>카카오톡 오픈채팅방을 통해 편리하게 소통하실 수 있습니다.</li>
            <li>문의하실때 소속, 성명, 학번을 밝혀주세요.</li>
            <li>접수하신 민원은 확인 후 빠른 시일 내에 답변드리겠습니다.</li>
          </ul>
        </div>

        <div className="kakao-main-card">
          <div className="kakao-card-info">
            <RiKakaoTalkFill className="kakao-card-icon" />
            <div className="kakao-card-text">
              <h2>전북대학교 공과대학 민원접수 채팅방</h2>
              <p>아래 버튼을 클릭하여 카카오톡 오픈채팅방으로 이동하세요</p>
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
              카카오톡 채팅방 입장하기
            </motion.button>

            <div className="kakao-qr-section">
              <div className="kakao-qr-container">
                <img src={kakaoQR} alt="카카오톡 오픈채팅 QR코드" className="kakao-qr-image" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Report;

