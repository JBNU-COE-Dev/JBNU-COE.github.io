import React from 'react';
import { motion } from 'framer-motion';
import './ContactPage.css';

/**
 * 소통(contact) 페이지 공통 셸.
 *
 * 게시판 이용 문의 / 민원 접수 / 카카오톡 채널 세 페이지가 같은 골격
 * (안내 + 카카오 연결 + 규정) 이라서 헤더 밴드와 2단 레이아웃을 공유합니다.
 * 헤더 밴드는 공지사항(announcement.css) 과 같은 구조이고, 상단 여백은
 * 고정된 TopBar + HeaderBar 를 비우는 사이트 공통값을 씁니다. (ContactPage.css)
 *
 * aside 는 넓은 화면에서 우측 sticky 레일, 좁은 화면에서는 본문 위로 올라옵니다.
 */
export default function ContactPage({ title, description, aside, asideLabel, children }) {
  return (
    <div className="contact-page">
      <motion.header
        className="contact-header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="contact-header-inner">
          <h1 className="contact-title">{title}</h1>
          {description && <p className="contact-description">{description}</p>}
        </div>
      </motion.header>

      <div className="contact-body">
        <main className="contact-main">{children}</main>

        {aside && (
          <aside className="contact-aside">
            {asideLabel && <span className="contact-label">{asideLabel}</span>}
            {aside}
          </aside>
        )}
      </div>
    </div>
  );
}

/** 라벨 + 내용 한 덩어리. count 를 주면 라벨 옆에 건수를 답니다. */
export function ContactSection({ label, count, children }) {
  return (
    <section className="contact-section">
      {label && (
        <div className="contact-section-head">
          <span className="contact-label">{label}</span>
          {count != null && <span className="contact-section-count">{count}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

/** 회색 점 불릿 목록. items 는 문자열 배열입니다. */
export function ContactList({ items }) {
  return (
    <ul className="contact-list">
      {items.map((text, i) => (
        <li key={i}>
          <span className="contact-list-dot" aria-hidden="true" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
