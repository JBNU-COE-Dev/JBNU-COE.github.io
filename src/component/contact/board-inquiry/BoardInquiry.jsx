import React from 'react';
import ContactPage, { ContactSection, ContactList } from '../ContactPage.jsx';
import KakaoCard from '../../common/KakaoCard';
import './BoardInquiry.css';
import kakaoQR from '../../../img/qr-code/kakaoQR.png';

const GUIDE = [
  '학생회 게시판을 통한 홍보 및 공지사항 게시가 가능합니다.',
  '게시판 이용을 원하시는 경우 사전에 문의해 주시기 바랍니다.',
  '카카오톡 오픈채팅방을 통해 편리하게 문의하실 수 있습니다.',
  '문의하신 내용은 확인 후 빠른 시일 내에 답변드리겠습니다.',
  '공과대학 학생회실로 직접 방문해 주시면 더 빠르게 처리해 드릴 수 있습니다.',
];

const STEPS = [
  {
    title: '학생회실로 게시물 가져오기',
    body: '부착할 게시물을 공과대학 학생회실(1호관 243호)로 가져와 주세요.',
  },
  {
    title: '학생회 확인 받기',
    body: '게시물에 대표자명(혹은 단체명)이 포함되어 있는지, 내용이 학생회칙에 부합하는지 공과대학 학생회의 확인을 받아 주세요.',
  },
  {
    title: '게시 기간 지키기',
    body: '최대 7일(사유·목적에 따라 14일까지 연장) 게시할 수 있으며, 기간을 초과하면 철거될 수 있습니다.',
  },
];

const RESTRICTIONS = [
  '특정 정치집단 관련 선전물',
  '음란물 및 기본적 윤리기준에 벗어나는 선전물',
  '총학생회 및 공과대학 학생회의 제휴업체를 제외한 상업성 광고물',
  '지정된 게시 장소 이외에 게시된 선전물',
];

/** 학생회칙 조항 하나. 기본은 접힌 상태이고 첫 조항만 펼쳐 둡니다. */
function Article({ number, title, defaultOpen = false, children }) {
  return (
    <details className="board-inquiry-article" open={defaultOpen}>
      <summary>
        <span className="board-inquiry-article-no">{number}</span>
        <span className="board-inquiry-article-title">{title}</span>
        <svg
          className="board-inquiry-article-chevron"
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
      <div className="board-inquiry-article-body">{children}</div>
    </details>
  );
}

const BoardInquiry = () => {
  return (
    <ContactPage
      title="게시판 이용 문의"
      asideLabel="문의 채널"
      aside={
        <KakaoCard
          kakaoUrl="https://open.kakao.com/o/suMsRU8h"
          title="게시판 이용 문의 채팅방"
          description="카카오톡 오픈채팅으로 문의하세요"
          buttonText="오픈채팅방 입장하기"
          qrImage={kakaoQR}
          qrAlt="카카오톡 오픈채팅 QR코드"
        />
      }
    >
      <ContactSection label="안내">
        <ContactList items={GUIDE} />
      </ContactSection>

      <ContactSection label="게시판 사용 절차">
        <ol className="board-inquiry-steps">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <span className="board-inquiry-step-no" aria-hidden="true">{i + 1}</span>
              <div className="board-inquiry-step-text">
                <p className="board-inquiry-step-title">{step.title}</p>
                <p className="board-inquiry-step-body">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </ContactSection>

      <ContactSection label="학생회칙 — 게시 관련 조항">
        <div className="board-inquiry-articles">
          <Article number="제68조" title="게시 조건" defaultOpen>
            <p>
              선전물을 게시하려는 학우는 본회에 내용과 게시 날짜를 통보하여야 하며 게시물에 대한 확인을 받아야 한다.
              단체의 경우 단체명을, 개인의 경우 학부(과)와 학년 및 이름을 선전물에 게시하여야 한다.
              단, 동일 내용에 대한 게시물은 해당 게시판에 중복 게시할 수 없다.
            </p>
          </Article>

          <Article number="제69조" title="유지">
            <p>
              승인절차를 밟은 선전물에 대하여 공과대학 학생회는 선전물이 통보된 날짜까지 유지한다.
            </p>
          </Article>

          <Article number="제70조" title="제한">
            <p>다음과 같은 내용의 선전물은 게시가 제한됩니다.</p>
            <ol className="board-inquiry-restrictions">
              {RESTRICTIONS.map((text, i) => (
                <li key={text}>
                  <span aria-hidden="true">{i + 1}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </Article>

          <Article number="제71조" title="징계">
            <p>
              위 조항을 위반 및 불법 게시 시 해당 단체 및 개인에게 경고를 가하고 철거를 요청 및 직접 철거할 수 있다.
              연속 2회 경고, 누적 3회 경고 시 마지막 경고 일부터 한 달간 게시를 금하며, 4회 경고 시 3개월,
              5회 경고 시 6개월 게시를 금할 수 있다. 6회 이상 경고 시 영구히 게시를 금한다.
            </p>
          </Article>

          <Article number="제72조" title="예외">
            <p>
              각 학부(과) 전공 학생회와 공과대학 동아리 선전물일 경우 제68조와 제69조를 의무화 하는 조건으로
              게시의 자율성을 보장한다.
            </p>
          </Article>
        </div>
      </ContactSection>
    </ContactPage>
  );
};

export default BoardInquiry;
