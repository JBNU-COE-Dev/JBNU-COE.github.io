import React from 'react';
import { motion } from 'framer-motion';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaBullhorn, FaEnvelope } from 'react-icons/fa';
import './BoardInquiry.css';

const BoardInquiry = () => {
  const kakaoUrl = 'https://open.kakao.com/o/suMsRU8h';

  const handleKakaoClick = () => {
    window.open(kakaoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="board-inquiry-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="board-inquiry-header">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaBullhorn className="board-inquiry-main-icon" />
        </motion.div>
        <h1>게시판 이용 문의</h1>
        <p>홍보 및 게시판 이용이 필요한 인원을 위한 안내 페이지입니다</p>
      </div>

      <motion.div
        className="board-inquiry-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="board-inquiry-info-box">
          <h2>📢 게시판 이용 안내</h2>
          <p className="info-description">
            공과대학 학생회 게시판을 통한 홍보나 공지사항 게시를 원하시는 경우, 
            아래 연락처를 통해 문의해주시기 바랍니다.
          </p>
          <ul className="board-inquiry-info-list">
            <li>학생회 게시판을 통한 홍보 및 공지사항 게시가 가능합니다.</li>
            <li>게시판 이용을 원하시는 경우 사전에 문의해주시기 바랍니다.</li>
            <li>카카오톡 오픈채팅방을 통해 편리하게 문의하실 수 있습니다.</li>
            <li>문의하신 내용은 확인 후 빠른 시일 내에 답변드리겠습니다.</li>
            <li>게시판 이용 문의시 공과대학 학생회실로 방문해주시면 빠른처리가 가능합니다.</li>
          </ul>
        </div>

        <div className="contact-methods">
          <motion.div
            className="contact-kakao-section"
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
        </div>

        <div className="board-inquiry-notice">
          <h2>⚠️ 유의사항</h2>
          
          <div className="notice-section">
            <h3>공과대학 게시판 사용 절차</h3>
            <ol className="procedure-list">
              <li>부착할 게시물을 공과대학 학생회실(1호관 243호)로 가져와주세요.</li>
              <li>게시물에 대표자명(혹은 단체명)이 포함되어 있는지, 게시물 내용이 학생회칙에 부합하는지 공과대학 학생회의 확인을 받아주세요.</li>
              <li>게시물은 최대 7일(사유 ‧ 목적에 따라 14일까지 연장) 게시할 수 있으며, 게시 기간을 초과할 경우 철거될 수 있습니다.</li>
            </ol>
          </div>

          <div className="notice-section">
            <h3>학생회칙 - 게시 관련 조항</h3>
            
            <div className="regulation-item">
              <h4>제68조 【게시 조건】</h4>
              <p>선전물을 게시하려는 학우는 본회에 내용과 게시 날짜를 통보하여야 하며 게시물에 대한 확인을 받아야 한다. 단체의 경우 단체명을, 개인의 경우 학부(과)와 학년 및 이름을 선전물에 게시하여야 한다. 단, 동일 내용에 대한 게시물은 해당 게시판에 중복 게시할 수 없다.</p>
              <h4>제69조 【유지】</h4>
              <p>승인절차를 밟은 선전물에 대하여 공과대학 학생회는 선전물이 통보된 날짜까지 유지한다.</p>
              <h4>제70조 【제한】</h4>
              <p>다음과 같은 내용의 선전물은 게시가 제한됩니다:</p>
              <ol className="restriction-list">
                <li>특정 정치집단 관련 선전물</li>
                <li>음란물 및 기본적 윤리기준에 벗어나는 선전물</li>
                <li>총학생회 및 공과대학 학생회의 제휴업체를 제외한 상업성 광고물</li>
                <li>지정된 게시 장소 이외에 게시된 선전물</li>
              </ol>
              <h4>제71조 【징계】</h4>
              <p>위 조항을 위반 및 불법 게시 시 해당 단체 및 개인에게 경고를 가하고 철거를 요청 및 직접 철거할 수 있다. 연속 2회 경고, 누적 3회 경고 시 마지막 경고 일부터 한 달간 게시를 금하며, 4회 경고 시 3개월, 5회 경고 시 6개월 게시를 금할 수 있다. 6회 이상 경고 시 영구히 게시를 금한다.</p>
              <h4>제72조 【예외】</h4>
              <p>각 학부(과) 전공 학생회와 공과대학 동아리 선전물일 경우 제68조와 제69조를 의무화 하는 조건으로 게시의 자율성을 보장한다.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BoardInquiry;

