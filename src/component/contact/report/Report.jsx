import React from 'react';
import ContactPage, { ContactSection, ContactList } from '../ContactPage.jsx';
import KakaoCard from '../../common/KakaoCard';
import './Report.css';
import kakaoQR from '../../../img/qr-code/kakaoQR.png';

const GUIDE = [
  '학생회에 건의사항이나 문의사항이 있으시면 언제든지 연락해 주세요.',
  '카카오톡 오픈채팅방을 통해 편리하게 소통하실 수 있습니다.',
  '접수하신 민원은 확인 후 빠른 시일 내에 답변드리겠습니다.',
];

const REQUIRED = ['소속', '성명', '학번'];

const Report = () => {
  return (
    <ContactPage
      title="민원 접수"
      description="학생회에 건의하거나 문의할 내용이 있다면 카카오톡 오픈채팅으로 연락해 주세요."
      asideLabel="접수 채널"
      aside={
        <KakaoCard
          kakaoUrl="https://open.kakao.com/o/suMsRU8h"
          title="민원접수 채팅방"
          description="카카오톡 오픈채팅으로 접수하세요"
          buttonText="오픈채팅방 입장하기"
          qrImage={kakaoQR}
          qrAlt="카카오톡 오픈채팅 QR코드"
        />
      }
    >
      <ContactSection label="안내">
        <ContactList items={GUIDE} />
      </ContactSection>

      <ContactSection label="문의 시 꼭 알려주세요">
        <div className="contact-card report-required">
          <p>
            민원을 정확히 확인하고 답변드릴 수 있도록, 채팅을 시작하실 때 아래 세 가지를 함께 남겨 주세요.
          </p>
          <div className="report-required-chips">
            {REQUIRED.map((label) => (
              <span key={label} className="report-required-chip">{label}</span>
            ))}
          </div>
        </div>
      </ContactSection>
    </ContactPage>
  );
};

export default Report;
