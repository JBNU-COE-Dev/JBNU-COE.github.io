import React from 'react';
import './organization.css';

const ORG = {
  leaders: [
    { role: '회장', name: '탁형진' },
    { role: '부회장', name: '최용준' },
  ],
  chair: { title: '집행위원장', name: '김하민' },
  depts: [
    { name: '기획국', head: '정호선', vice: '백지영', members: ['오송현','윤다원','이해인','조인호'] },
    { name: '대외협력국', head: '유승희', vice: '백지민', members: ['김수아','박시은','백혜령','홍주영'] },
    { name: '문화예술국', head: '송혜윤', vice: '박종범', members: ['김나영','박요셉','박윤진','정수진','천유민'] },
    { name: '사무국', head: '김덕현', vice: '이승주', members: ['김정아','박효빈','서준혁','최민서'] },
    { name: '운영지원국', head: '허의영', vice: '김수빈', members: ['문보윤','박지혜','유나연','장기욱'] },
    { name: '취업학습국', head: '허정무', vice: '서배광', members: ['김지후','임예진','장서연','최주호'] },
    { name: '학생복지국', head: '정주원', vice: '김고은', members: ['김유민','이다원','전민우','정다인'] },
    { name: '홍보국', head: '박하영', vice: '박준혁', members: ['김시연','서준이','오예린','조영빈'] },
  ]
};

export default function Organization() {
  return (
    <div className="org-page">
      {/* TOP: 회장/부회장 */}
      <div className="org-top">
        <div className="org-leaders">
          {ORG.leaders.map((l, idx) => (
            <div key={idx} className="org-leader-card">
              <div className="org-leader-role">{l.role}</div>
              <div className="org-leader-name">{l.name}</div>
            </div>
          ))}
          {/* rail 제거 */}
        </div>
        {/* rail 제거 */}
        <div className="org-chair">
          <div className="org-chair-title">{ORG.chair.title}</div>
          <div className="org-chair-name">{ORG.chair.name}</div>
        </div>
      </div>

      {/* DEPARTMENTS */}
      <div className="org-depts">
        <div className="org-grid">
          {ORG.depts.map((d, idx) => (
            <section key={idx} className="org-dept">
              {/* rail 제거 */}
              <h3 className="org-dept-title">{d.name}</h3>
              <div className="org-dept-roles">
                <div className="org-role">
                  <div className="org-role-title">국장</div>
                  <div className="org-role-name">{d.head}</div>
                </div>
                <div className="org-role">
                  <div className="org-role-title">부국장</div>
                  <div className="org-role-name">{d.vice}</div>
                </div>
              </div>
              <div className="org-divider" />
              <div className="org-members">
                <div className="org-members-title">국원</div>
                <ul className="org-member-list">
                  {d.members.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}


