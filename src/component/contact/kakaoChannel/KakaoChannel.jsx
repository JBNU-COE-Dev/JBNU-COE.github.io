import React from 'react';
import { motion } from 'framer-motion';
import { RiKakaoTalkFill } from 'react-icons/ri';
import KakaoCard from '../../common/KakaoCard';
import kakaoQR from '../../../img/qr-code/kakaoChQR.png';
import './KakaoChannel.css';

const KakaoChannel = () => {
  return (
    <motion.div
      className="kakao-channel-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="kakao-channel-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <KakaoCard
          kakaoUrl="https://pf.kakao.com/_BHngn"
          title="전북대학교 공과대학 학생회 카카오톡 채널"
          description="학생회와 실시간으로 소통하고, 문의사항을 편리하게 전달하세요"
          buttonText="카카오톡 채널 입장하기"
          qrImage={kakaoQR}
          qrAlt="카카오톡 채널 QR 코드"
        />

        <div className="kakao-channel-notice">
          <h3>이용 안내</h3>
          <ul>
            <li>카카오톡 앱이 설치되어 있어야 합니다.</li>
            <li>카카오톡 채널은 누구나 자유롭게 친구 추가할 수 있습니다.</li>
            <li>욕설, 비방 등 부적절한 내용은 제재될 수 있습니다.</li>
            <li>개인정보 보호를 위해 민감한 정보는 공개하지 말아주세요.</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default KakaoChannel;

