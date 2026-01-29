import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaInstagram, FaComment, FaArrowUp } from 'react-icons/fa';
import './FloatingButton.css';

function FloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToTop = () => {
    const container = document.querySelector('.app-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const links = {
    instagram: 'https://www.instagram.com/jbnu_coe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    kakao: 'https://pf.kakao.com/_BHngn'
  };

  const subButtonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.25,
        ease: 'easeOut'
      }
    }),
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  };

  return (
    <div className="floating-button-container">
      <AnimatePresence>
        {isOpen && (
          <div className="fab-sub-buttons">
            {/* 카카오톡 버튼 */}
            <motion.a
              href={links.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="fab-sub-button kakao"
              custom={0}
              variants={subButtonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              title="카카오톡 채널"
            >
              <FaComment />
            </motion.a>

            {/* 인스타그램 버튼 */}
            <motion.a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="fab-sub-button instagram"
              custom={1}
              variants={subButtonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              title="인스타그램"
            >
              <FaInstagram />
            </motion.a>

            {/* 최상단 스크롤 버튼 */}
            <motion.button
              className="fab-sub-button scroll-top"
              custom={2}
              variants={subButtonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={scrollToTop}
              title="맨 위로"
            >
              <FaArrowUp />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* 메인 FAB 버튼 */}
      <motion.button
        className={`fab-main-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      >
        <FaPlus />
      </motion.button>
    </div>
  );
}

export default FloatingButton;
