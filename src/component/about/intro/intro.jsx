import React, { useState } from 'react';
import ImageSlider from '../../home/imageSlider/imageSlider.jsx';
import organizationImg from '../../../img/organization/organization.jpg';
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
                                <h2 className='h2-text1'>공대인의 FEEL, 그대와 함께 필:花! 전북대학교 제57대 공과대학 학생회입니다.</h2>
                                <p>전북대학교 공과대학 학생회는 공과대학 8,000 학우 여러분의 목소리를 대변하고,<br/>
                                더 나은 대학 생활을 만들기 위해 봉사하는 학생 자치기구입니다.</p>
                                <p>저희 '필:花' 학생회는 학우 여러분의 필요(FEEL)가 활짝 피어날 수 있도록(花) 다음과 같은 핵심 가치를 중심으로 활동합니다:</p>
                                <ul className="intro-list">
                                    <li><strong>소통과 공감:</strong> 정기적인 소통 창구를 통해 학우들의 의견을 적극적으로 수렴하고, 정책 결정 과정에 반영하여 투명하고 신뢰받는 학생회를 만들겠습니다.</li>
                                    <li><strong>권익 보호:</strong> 학업, 복지, 시설 등 다방면에서 학우들이 겪는 어려움을 해결하고, 부당한 일에 대해서는 단호하게 목소리를 내어 학우들의 권익을 최우선으로 보호하겠습니다.</li>
                                    <li><strong>복지 증진:</strong> 낡은 시설 개선, 편의 공간 확충 등 실질적으로 체감할 수 있는 복지 정책을 추진하여 쾌적하고 편리한 캠퍼스 환경을 조성하겠습니다.</li>
                                    <li><strong>기회와 경험:</strong> 학술제, E-sports 대회, 문화 행사 등 다채로운 프로그램을 기획하여 학우들의 잠재력을 마음껏 펼치고 소중한 추억을 쌓을 수 있는 기회의 장을 마련하겠습니다.</li>
                                    <li><strong>연대와 협력:</strong> 각 학부(과) 학생회와 긴밀히 협력하여 공과대학 전체의 화합과 발전을 도모하고, 함께 성장하는 공동체를 만들겠습니다.</li>
                                </ul>
                                <p>학우 여러분의 관심과 참여가 '필:花' 학생회를 움직이는 가장 큰 원동력입니다.<br/> 언제나 열린 마음으로 여러분 곁에서 함께하겠습니다.</p>
                                <div className="quote">학우 여러분의 필요(FEEL)가 활짝 피어나는(花) 공과대학을 만들겠습니다.</div>
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
                                    <img src={require('../../../img/ryu.png')} alt="공과대학 학생회장" />
                                    <div className="title-box">공과대학 학생회장</div>
                                    <div className="name">류이노</div>
                                </div>
                            </div>
                            <div className="right-container">
                                <h2 className='h2-text1'>안녕하십니까, 공대인의 FEEL, 그대와 함께 필:花 <br />제57대 필 공과대학 학생회입니다.</h2>
                                <p>학교에 큰 변화가 찾아왔을 때 학생회의 역할은 더욱 막중해집니다. 코로나 이후 <br/> 
                                정상적인 대학생활로 돌아온 지 얼마 되지 않은 지금, '글로컬30'이라는 새로운 <br/>
                                변화의 바람이 불고 있습니다.</p>
                                <p>필:花 공과대학 학생회는, 새로운 전북대, 그 속에서 '새로운 공과대학'을 만들겠<br/> 
                                습니다. 필 공과대학 학생회는 예측과 대비를 통해 실질적이고 현실적인 해결방<br/>
                                안을 제시하겠습니다. 급변하는 상황에 맞게, 모든 학우분들이 즐길 수 있는 행사<br/> 
                                를 만들기 위하여 최선을 다하며, 기존의 각 학부(학과) 학생회의 자치기구로서<br/> 
                                역할을 재정립하겠습니다. </p>
                                <p>'학생회의 본질'에 집중하겠습니다. 학생회는 학우들이 있기에 존재하며, 그들의<br/> 
                                의 목소리가 학생회의 방향을 결정짓습니다. 학우들의 의견과 필요에 귀 기울이며,<br/> 
                                그 권역을 대변하는 데 최선을 다하겠습니다.</p>
                                <p>'실질적인 도움'을 드리겠습니다. 학우분들의 피부에 와 닿는 정책은 무엇일까 끊<br/> 
                                임 없이 고민하고 소통하여 학우분들이 원하는 공과대학을 만들겠습니다. 공과대<br/>
                                학 학우분들의 대학생활에 실질적으로 도움을 드리는 필:花 공과대학 학생회가<br/>
                                되겠습니다.</p>
                                <div className="quote">공대인의 FEEL, 그대와 함께 필:花</div>
                                <h2 className="sign">제 57대 필 공과대학 학생회장 류이노</h2>
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
                                    <img src={require('../../../img/kim.png')} alt="공과대학 학생회 부회장" />
                                    <div className="title-box">공과대학 학생회 부회장</div>
                                    <div className="name">김범준</div>
                                </div>
                            </div>
                            <div className="right-container">
                                <h2 className='h2-text1'>안녕하십니까, 공대인의 FEEL, 그대와 함께 필:花 <br />제57대 필 공과대학 학생회 부회장 김범준입니다.</h2>
                                <p>
                                    존경하는 공과대학 학우 여러분, 단순한 지지자나 조력자를 넘어, 여러분의 생각과 꿈에<br/>
                                    강력한 추진력을 더하는 '엔진'이 되겠습니다. 회장단이 나아갈 방향을 굳건히 지지하면서도,<br/>
                                    가장 가까운 곳에서 여러분의 목소리에 귀 기울이며 세심한 부분까지 놓치지 않겠습니다.
                                </p>
                                <p>
                                    '실행력'이야말로 학생회의 핵심 가치라 믿습니다. 여러분의 기발한 아이디어나 당연한 권리에 대한<br/>
                                    목소리가 공허한 외침으로 끝나지 않도록, 제가 직접 발로 뛰며 가시적인 변화를<br/>
                                    만들어내겠습니다. 복잡한 행정 절차의 벽을 허물고, 여러분의 필요가 가장 빠른 길로<br/>
                                    해결될 수 있도록 만드는 '해결사'가 되겠습니다.
                                </p>
                                <p>
                                    낡은 관행은 과감히 개선하고, 새로운 시도를 두려워하지 않겠습니다. 스터디 공간 개선과 같은<br/>
                                    기본적인 복지를 넘어, 기업 현직자 및 졸업생 선배들과의 네트워킹 기회를 확대하고,<br/>
                                    창업이나 프로젝트 동아리에 대한 실질적인 지원을 이끌어내는 등 여러분의 미래 경쟁력을<br/>
                                    높이는 데 집중하겠습니다. 여러분의 대학 생활이 단지 학점 취득의 과정이 아닌,<br/>
                                    무한한 가능성을 탐색하는 '기회의 장'이 되도록 만들겠습니다.
                                </p>
                                <p>
                                    8,000 공대 학우 여러분의 열정과 기대를 동력 삼아, 회장님과 함께 '필:花'의 약속들을<br/>
                                    하나하나 채워나가겠습니다. 우리의 함성이 하나 될 때, 우리가 꿈꾸는 변화는 현실이 됩니다.<br/>
                                    언제든 편하게 다가와 여러분의 생각과 비전을 나눠주시길 바랍니다.
                                </p>
                                <div className="quote">말로만 그치지 않겠습니다. 행동으로 증명하고, 결과로 보답하겠습니다.</div>
                                <h2 className="sign">제 57대 필 공과대학 학생회 부회장 김범준</h2>
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
            <div id="slider-container" className="imageSlider-container">
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