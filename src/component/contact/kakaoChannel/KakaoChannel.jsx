import React from 'react';
import { motion } from 'framer-motion';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaComments, FaQrcode, FaMobileAlt } from 'react-icons/fa';
import './KakaoChannel.css';

const KakaoChannel = () => {
  const kakaoUrl = 'https://open.kakao.com/o/s1TJTDYh';

  const handleKakaoClick = () => {
    window.open(kakaoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="kakao-channel-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="kakao-channel-header">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <RiKakaoTalkFill className="kakao-channel-main-icon" />
        </motion.div>
        <h1>카카오톡 채널</h1>
        <p>전북대학교 공과대학 학생회와 소통하세요</p>
      </div>

      <motion.div
        className="kakao-channel-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="kakao-channel-main-card">
          <div className="kakao-channel-info">
            <RiKakaoTalkFill className="kakao-channel-icon" />
            <div className="kakao-channel-text">
              <h2>전북대학교 공과대학 학생회 오픈채팅방</h2>
              <p>학생회와 실시간으로 소통하고, 민원 접수 및 문의사항을 편리하게 전달하세요</p>
            </div>
          </div>
          
          <motion.button
            className="kakao-channel-button"
            onClick={handleKakaoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RiKakaoTalkFill className="button-icon" />
            카카오톡 채팅방 입장하기
          </motion.button>
        </div>

        <div className="kakao-channel-features">
          <div className="feature-card">
            <FaComments className="feature-icon" />
            <h3>실시간 소통</h3>
            <p>학생회와 직접 대화하며<br/>궁금한 사항을 물어보세요</p>
          </div>
          <div className="feature-card">
            <FaMobileAlt className="feature-icon" />
            <h3>편리한 접근</h3>
            <p>모바일에서도 쉽게<br/>접속할 수 있습니다</p>
          </div>
          <div className="feature-card">
            <FaQrcode className="feature-icon" />
            <h3>빠른 참여</h3>
            <p>버튼 클릭 한 번으로<br/>채팅방에 입장하세요</p>
          </div>
        </div>

        <div className="kakao-channel-notice">
          <h3>이용 안내</h3>
          <ul>
            <li>카카오톡 앱이 설치되어 있어야 합니다.</li>
            <li>오픈채팅방은 누구나 자유롭게 참여할 수 있습니다.</li>
            <li>욕설, 비방 등 부적절한 내용은 제재될 수 있습니다.</li>
            <li>개인정보 보호를 위해 민감한 정보는 공개하지 말아주세요.</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default KakaoChannel;

