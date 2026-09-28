import React from 'react';
import ContactPage, { ContactSection, ContactList } from '../ContactPage.jsx';
import KakaoCard from '../../common/KakaoCard';
import kakaoQR from '../../../img/qr-code/kakaoChQR.png';

const GUIDE = [
  '카카오톡 앱이 설치되어 있어야 합니다.',
  '카카오톡 채널은 누구나 자유롭게 친구 추가할 수 있습니다.',
  '욕설, 비방 등 부적절한 내용은 제재될 수 있습니다.',
  '개인정보 보호를 위해 민감한 정보는 공개하지 말아 주세요.',
];

const KakaoChannel = () => {
  return (
    <ContactPage
      title="카카오톡 채널"
      description="학생회와 실시간으로 소통하고, 문의사항을 편리하게 전달할 수 있는 공식 채널입니다."
      asideLabel="공식 채널"
      aside={
        <KakaoCard
          kakaoUrl="https://pf.kakao.com/_BHngn"
          title="공과대학 학생회 채널"
          description="친구 추가하고 소식을 받아보세요"
          buttonText="카카오톡 채널 입장하기"
          qrImage={kakaoQR}
          qrAlt="카카오톡 채널 QR 코드"
          qrText="QR로 채널 추가"
        />
      }
    >
      <ContactSection label="이용 안내">
        <ContactList items={GUIDE} />
      </ContactSection>
    </ContactPage>
  );
};

export default KakaoChannel;
