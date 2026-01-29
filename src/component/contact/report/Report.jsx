import React from 'react';
import { motion } from 'framer-motion';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaComments } from 'react-icons/fa';
import './Report.css';

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

        <motion.div
          className="report-kakao-section"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="kakao-info">
            <RiKakaoTalkFill className="kakao-icon" />
            <div className="kakao-text">
              <h3>전북대학교 공과대학 민원접수 채팅방</h3>
              <p>아래 버튼을 클릭하여 카카오톡 오픈채팅방으로 이동하세요</p>
            </div>
          </div>
          
          <motion.button
            className="kakao-button"
            onClick={handleKakaoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RiKakaoTalkFill className="button-icon" />
            카카오톡 채팅방 입장하기
          </motion.button>
        </motion.div>

        <div className="report-notice">
          <h3>⚠️ 유의사항</h3>
          <ul>
            <li>욕설, 비방 등 부적절한 내용은 답변이 제한될 수 있습니다.</li>
            <li>개인정보 보호를 위해 민감한 정보는 공개하지 말아주세요.</li>
            <li>긴급한 사항은 학생회 사무실(063-270-XXXX)로 직접 연락해주세요.</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Report;

