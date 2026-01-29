import React, { useState } from 'react';
import ImageSlider from '../../home/imageSlider/imageSlider.jsx';
import organizationImg from '../../../img/student-council/2026/2026_organization.jpg';
import mainSlider1 from '../../../img/main-slider/main-slider1.JPG';
import mainSlider2 from '../../../img/main-slider/main-slider2.JPG';
import mainSlider3 from '../../../img/main-slider/main-slider3.JPG';
import mainSlider4 from '../../../img/main-slider/main-slider4.JPG';
import mainSlider5 from '../../../img/main-slider/main-slider5.JPG';
import { FaHome, FaChevronDown, FaUser } from 'react-icons/fa';

import './intro.css';

const Intro = () => {
    const slides = [{image: mainSlider1}, {image: mainSlider2}, {image: mainSlider3}, {image: mainSlider4}, {image: mainSlider5}];
    const [currentContent, setCurrentContent] = useState('intro'); // 'intro', 'president', 'vice-president'

    const handleMenuClick = (content) => {
        console.log('Menu clicked:', content);
        console.log('Setting currentContent to:', content);
        setCurrentContent(content);
    };

    const renderContent = () => {
        switch(currentContent) {
            case 'intro':
                return (
                    <div className="main-wrapper">
                        <h1 className="greeting-title">학생회 소개</h1>
                        <div className="main-container">
                            <div className="left-container">
                                <div className="image-container org-image-large">
                                    <img src={organizationImg} alt="공과대학 학생회 조직도" />
                                </div>
                            </div>
                            <div className="right-container">
                                <h2 className='h2-text1'>'공대의 진심이, 그대의 결심으로'<br/>전북대학교 제58대 심(心) 공과대학 학생회입니다.</h2>
                                <p>전북대학교 공과대학 학생회는 공과대학 학우 여러분의 목소리를 가장 가까이에서 듣고,<br/>
                                더 나은 학습 환경과 대학 생활을 만들어가기 위해 노력하는 학생자치기구입니다.</p>
                                <p>저희 심 공과대학 학생회는 공대의 진심이, 그대의 결심으로 이어질 수 있도록<br/>
                                학우 여러분들의 현실적인 고민과 필요에 진심으로 응답하는 학생회가 되고자 합니다.<br/>
                                변화하는 대학 환경 속에서도 중심을 잃지 않고, 학우들과 같은 방향을 바라보며 함께 발맞춰 나아가겠습니다.</p>
                                <p>특히 글로컬 30 체제 도입 이후, 학교는 새로운 전환기를 맞이하고 있습니다.<br/>
                                제도의 변화가 또 다른 부담으로 남지 않도록,<br/>
                                학생회는 안정화의 과정 속에서 학우들의 입장을 대변하는 역할에 더욱 충실하겠습니다.</p>
                                <ul className="intro-list">
                                    <li><strong>소통:</strong> '공식 카카오톡 채널'과, '카카오톡 오픈채팅방'을 활용하여 언제 어디서든 학우 여러분의 이야기를 듣고, 의견 수렴에 그치지 않고, 해결로 이어지는 학생회가 되겠습니다.</li>
                                    <li><strong>복지:</strong> 학우 여러분의 일상에 실질적으로 도움이 되는 복지를 고민하겠습니다. 불편함 개선과 더 나은 학교생활을 위해 노후화된 시설과 안전 문제를 지속적으로 점검하고 해결하겠습니다.</li>
                                    <li><strong>기회와 경험:</strong> '공과대학 맞춤형 컨설팅'과 '분야별 기업탐방'으로 공과대학 학우분들의 진로와 미래를 위해 취업 증진과 진로 탐색에 실질적인 도움이 되는 지원책을 마련하겠습니다.</li>
                                    <li><strong>연대와 협력:</strong> '심(心)부름 센터'를 통해 각 학부(과) 학생회와의 긴밀한 협력을 바탕으로 공과대학 체전 및 국토대장정을 통해 단합을 형성하고 학우분들의 연대를 실현하겠습니다.</li>
                                </ul>
                                <p>공과대학 학생회의 중심에는 언제나 학우 여러분이 있습니다.</p>
                                <p>제58대 심(心) 공과대학 학생회는 항상 열린 자세로 학우 여러분 곁에서 함께 고민하고, 함께 행동하겠습니다.</p>
                                <div className="quote">공대의 진심이, 그대의 결심으로 이어질 수 있도록.<br/>학우 여러분과 함께 만들어가는 2026년이 되겠습니다.</div>
                            </div>
                        </div>
                    </div>
                );
            case 'president':
                return (
                    <div className="main-wrapper">
                        <h1 className="greeting-title">회장단 인사말</h1>
                        <div className="main-container">
                            <div className="left-container">
                                <div className="image-container">
                                    <img src={require('../../../img/student-council/2026/2026_tak.jpg')} alt="공과대학 학생회장" />
                                    <div className="title-box">공과대학 학생회장</div>
                                    <div className="name">탁형진</div>
                                </div>
                            </div>
                            <div className="right-container">
                                <h2 className='h2-text1'>안녕하십니까 공대의 진심이 그대의 결심으로, <br />제58대 심 공과대학 학생회입니다.</h2>
                                <section>
                                    <p>
                                        학교는 새롭고 빠르게 변화하고 있습니다. 이러한 변화 속에서 공과대학 역시 발맞춰 나아가야 하며, 그 과정에서 학생회의 역할은 점점 더 중요해지고 있습니다.<br/>
                                        현재 우리 대학은 ‘글로컬 30’이라는 큰 변화를 맞이하고 있습니다.
                                        다사다난한 상황 속에서도 공과대학이 더욱 발전할 수 있는 환경을 조성하는 것이 필요합니다.
                                    </p>
                                </section>
                                <section>
                                    <p>
                                        <p>’심(心)‘ 공과대학 학생회는</p>
                                        성장하는 전북대학교, ’함께 발맞춰 걸어가는 공과대학‘을 만들겠습니다.<br/>
                                        학생회는 단순한 대리인이 아니라, 학우들과 함께 길을 만드는 공동체, 함께 ‘발 맞춰 함께 걷는 학생회‘ 만들도록 하겠습니다<br/>
                                        학우의 곁에서 문제를 바라보고, 함께 고민하고, 함께 해결해 나아가는 학생회가 되어야 한다고 생각합니다 그래서 모든 학우들이 언제든 목소리를 낼 수 있는 체계를 구축하겠습니다.<br/>
                                        수집된 문제들을 정리하고, 학교와의 협의 구조 속에서 적극적으로 나아가겠습니다.<br/>
                                    </p>
                                </section>
                                <section>
                                    <p>
                                        <p>변화하는 공과대학, 기회를 만드는 공과대학을 만들겠습니다.</p>
                                        2025년부터 시행된 ‘글로컬 30’은 전북대학교와 공과대학에 큰 변화를 가져왔고, 학사 제도와 대학 운영 전반에 영향을 미치고 있습니다.<br/>
                                        2026년은 이 변화를 안정화하고, 적응을 넘어 도약해야 하는 시기입니다.<br/>
                                        그렇기에 24개 학부(학과) 자치기구와의 협력이 더욱 중요합니다.<br/>
                                        ‘글로컬 30’의 흐름 속에서 학우들의 불안을 줄이고, 변화가 곧 기회가 되도록 만들겠습니다.<br/>
                                        공과대학의 정체성을 지키며 시대의 변화를 기회로 바꾸는 학생회로 거듭 될 수 있도록최선을 다하는 공과대학이 되겠습니다.<br/>
                                    </p>
                                </section>
                                <section>
                                    <p>
                                        <p>선한 영향력, 함께하는 공과대학을 만들겠습니다.</p>
                                        학생회는 변화에 대해 이끄는 주체여야 합니다.<br/>
                                        진정한 변화는 위로부터의 지침이 아니라, 학우들의 자발적인 참여와 협력 속에서 완성됩니다.<br/>  
                                        학생회는 학우들의 목소리에 귀 기울이며, 선한 영향력으로 함께하는 공동체를 만들어가겠습니다.<br/>
                                        공과대학 모든 학부와 학과의 의견을 책임 있게 수렴하고 실행하며, 진심으로 신뢰받는 학생자치기구를 확립하겠습니다.
                                        ‘심(心)’ 공과대학 학생회는 자발적 동참을 이끄는 학생회로서,<br/>
                                        학우 여러분과 함께 더 나은 공과대학의 미래를 열어가겠습니다.<br/>
                                    </p>
                                </section>
                                <div className="quote">공대의 결심이 그대의 결심으로.</div>
                                <h2 className="sign">제 58대 심 공과대학 학생회장 탁형진</h2>
                            </div>
                        </div>
                    </div>
                );
            case 'vice-president':
                return (
                    <div className="main-wrapper">
                        <h1 className="greeting-title">부회장 인사말</h1>
                        <div className="main-container">
                            <div className="left-container">
                                <div className="image-container">
                                    <img src={require('../../../img/student-council/2026/2026_choi.jpg')} alt="공과대학 학생회 부회장" />
                                    <div className="title-box">공과대학 학생회 부회장</div>
                                    <div className="name">최용준</div>
                                </div>
                            </div>
                            <div className="right-container">
                                <h2 className='h2-text1'>안녕하십니까.
                                    공대의 진심이 그대의 결심으로<br/>
                                    제 58대 심 공과대학 학생회 부회장 최용준입니다.
                                </h2>
                                    <p>
                                        <p>
                                            2026년은 변화의 ‘도입’이 아닌, 안정과 정착의 해가 되어야 합니다.
                                        </p>
                                        변화된 제도가 학우 여러분의 학업과 대학 생활 속에서 실제로 잘 작동할 수 있도록 세심하게 살피고, 부족한 부분은 학교와의 소통을 통해 꾸준히 개선해 나가고자 합니다.<br/>
                                        특히, 현장의 목소리가 행정에 전달되는 과정에서 누락되거나 왜곡되지 않도록, 학생자치기구의 대표자로서 책임감 있게 역할을 수행하겠습니다.
                                    </p>
                                    <p>
                                        <p>
                                            학생회는 앞에서 끌고 가는 조직이 아니라, 학우들과 같은 속도로 함께 걸어가는 조직이어야 한다고 생각합니다.
                                        </p>

                                        저는 부학생회장으로서 항상 한 발 앞서기보다, 한 발 옆에서 학우 여러분의 이야기를 듣고 함께 고민하는 사람이 되고자 합니다.
                                        작은 불편함도 지나치지 않고, 당연하다고 여겨졌던 문제에도 질문을 던질 수 있는 학생회, 그리고 학우들이 언제든지 목소리를 낼 수 있는 학생회를 만들어가겠습니다.    
                                    </p>
                                    <p>
                                        <p>
                                            공과대학은 끊임없는 도전과 시행착오 속에서 성장하는 공간입니다. 
                                        </p>

                                        그 과정이 때로는 어렵고 버겁게 느껴질지라도, 혼자가 아니라는 사실만으로도 한 걸음 더 나아갈 수 있다고 믿습니다. 
                                        학우 여러분이 각자의 자리에서 학업과 진로, 그리고 대학 생활을 충실히 이어갈 수 있도록, 공과대학 학생회가 든든한 뒷받침이 되겠습니다.
                                    </p>
                                    <p>
                                        <p>
                                            부족함이 많지만, 그만큼 더 배우고 더 움직이겠습니다.
                                        </p>
                                        말보다 행동으로, 형식보다 진정성으로 신뢰받는 부학생회장이 되겠습니다.<br/>
                                        공과대학 학우 여러분과 함께 호흡하며, 함께 만들어가는 2026년이 될 수 있도록 최선을 다하겠습니다.<br/>
                                        감사합니다.<br/>
                                    </p>
                                <div className="quote">말로만 그치지 않겠습니다. 행동으로 증명하고, 결과로 보답하겠습니다.</div>
                                <h2 className="sign">제 58대 심 공과대학 학생회 부회장 최용준</h2>
                            </div>
                        </div>
                    </div>

                    
                );
            default:
                return null;
        }
    };

    return (
        <div className="intro-container">
            <div className="imageSlider-container">
                <ImageSlider slides={slides} />
                {/* 분류바 추가 */}
                <div className="category-bar">
                    <div className="category-item">
                        <FaHome className="category-icon" />
                        <span className="category-text" onClick={() => handleMenuClick('intro')}>
                            학생회 소개
                        </span>
                    </div>
                    <div className="category-item dropdown-container">
                        <FaUser className="category-icon" />
                        <span className="category-text">
                            인사말
                            <FaChevronDown className="chevron-icon" />
                        </span>
                        <div className="dropdown-menu" style={{display: 'none'}}>
                            <div className="dropdown-item" onClick={() => handleMenuClick('president')}>
                                회장 인사말
                            </div>
                            <div className="dropdown-item" onClick={() => handleMenuClick('vice-president')}>
                                부회장 인사말
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="introduce-container">

            </div>
            
            {renderContent()}
            
        </div>
    );
};

export default Intro; 