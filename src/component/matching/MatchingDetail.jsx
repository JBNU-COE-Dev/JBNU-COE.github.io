import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBuilding, FaUsers, FaCalendarAlt, FaMapMarkerAlt, 
  FaStar, FaGlobe, FaGift, FaBookmark, FaRegBookmark,
  FaShareAlt, FaArrowLeft, FaHeart, FaEye, FaComment
} from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import './matchingDetail.css';

const MatchingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 임시 데이터 (추후 백엔드 API로 대체)
  const mockData = {
    id: 1,
    title: '[hy 한국야쿠르트] 이름있는 유산균 <바이오리브 서포터즈 마이크루> 모집',
    dDay: 17,
    views: 3395,
    comments: 1,
    thumbnail: 'https://via.placeholder.com/280x350',
    organizer: {
      name: 'hy(한국야쿠르트)',
      logo: 'https://via.placeholder.com/60x60',
      isFollowing: false,
    },
    details: {
      companyType: '대기업',
      targetAudience: '대학생',
      applicationPeriod: {
        start: '2026.01.26',
        end: '2026.02.15',
      },
      activityPeriod: '26.3 ~ 26.6',
      recruitCount: '25명',
      activityArea: '지역 제한없음',
      preferredSkills: '파워블로거/SNS, 사진/영상/디자인 툴, 콘텐츠 기획/제작 경험',
      homepage: 'https://www.hy.co.kr/',
      benefits: '활동비, 사은품 지급',
      additionalBenefits: '제품 판매 수익금 수수료 지급',
    },
    tags: {
      interest: ['요리/식품', '콘텐츠'],
      activity: ['서포터즈'],
    },
    bookmarkCount: 361,
    bookmarkedUsers: [
      'https://via.placeholder.com/32x32',
      'https://via.placeholder.com/32x32',
      'https://via.placeholder.com/32x32',
      'https://via.placeholder.com/32x32',
      'https://via.placeholder.com/32x32',
    ],
  };

  useEffect(() => {
    // TODO: 백엔드 API 호출로 대체
    // const fetchPost = async () => {
    //   try {
    //     const response = await matchingApi.getMatchingDetail(id);
    //     setPostData(response);
    //   } catch (error) {
    //     console.error('Failed to fetch matching detail:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPost();

    // 임시로 mock 데이터 사용
    setTimeout(() => {
      setPostData(mockData);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: 백엔드 API 호출
  };

  const handleApply = () => {
    if (postData?.details?.homepage) {
      window.open(postData.details.homepage, '_blank');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = postData?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      kakao: `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  };

  if (loading) {
    return (
      <div className="matching-detail-loading">
        <div className="loading-spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="matching-detail-error">
        <p>게시글을 찾을 수 없습니다.</p>
        <button onClick={handleBack}>돌아가기</button>
      </div>
    );
  }

  return (
    <motion.div 
      className="matching-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 뒤로가기 버튼 */}
      <button className="matching-detail-back" onClick={handleBack}>
        <FaArrowLeft /> 목록으로
      </button>

      {/* 헤더 섹션 */}
      <div className="matching-detail-header">
        <div className="matching-detail-badge">
          <span className="d-day-badge">D-{postData.dDay}</span>
        </div>
        <h1 className="matching-detail-title">{postData.title}</h1>
        <div className="matching-detail-meta">
          <span className="meta-item">
            <FaEye /> {postData.views.toLocaleString()}
          </span>
          <span className="meta-item">
            <FaComment /> {postData.comments}
          </span>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="matching-detail-content">
        {/* 좌측: 썸네일 이미지 */}
        <div className="matching-detail-thumbnail">
          <img src={postData.thumbnail} alt={postData.title} />
        </div>

        {/* 우측: 상세 정보 */}
        <div className="matching-detail-info">
          {/* 주최자 정보 */}
          <div className="organizer-card">
            <div className="organizer-info">
              <img 
                src={postData.organizer.logo} 
                alt={postData.organizer.name} 
                className="organizer-logo"
              />
              <span className="organizer-name">{postData.organizer.name}</span>
            </div>
            <div className="organizer-actions">
              <button className="follow-button">+팔로우</button>
              <button className="team-posts-button">팀원 모집글 보기</button>
            </div>
          </div>

          {/* 상세 정보 테이블 */}
          <div className="detail-table">
            <div className="detail-row">
              <div className="detail-cell">
                <span className="detail-label">기업형태</span>
                <span className="detail-value">{postData.details.companyType}</span>
              </div>
              <div className="detail-cell">
                <span className="detail-label">참여대상</span>
                <span className="detail-value">{postData.details.targetAudience}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-cell">
                <span className="detail-label">접수기간</span>
                <span className="detail-value">
                  <div className="period-info">
                    <span>시작일 | {postData.details.applicationPeriod.start}</span>
                    <span>마감일 | {postData.details.applicationPeriod.end}</span>
                  </div>
                </span>
              </div>
              <div className="detail-cell">
                <span className="detail-label">활동기간</span>
                <span className="detail-value">{postData.details.activityPeriod}</span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-cell">
                <span className="detail-label">모집인원</span>
                <span className="detail-value">{postData.details.recruitCount}</span>
              </div>
              <div className="detail-cell">
                <span className="detail-label">활동지역</span>
                <span className="detail-value">{postData.details.activityArea}</span>
              </div>
            </div>

            <div className="detail-row full-width">
              <div className="detail-cell">
                <span className="detail-label">우대역량</span>
                <span className="detail-value">{postData.details.preferredSkills}</span>
              </div>
              <div className="detail-cell">
                <span className="detail-label">홈페이지</span>
                <a 
                  href={postData.details.homepage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="detail-link"
                >
                  {postData.details.homepage}
                </a>
              </div>
            </div>

            <div className="detail-row full-width">
              <div className="detail-cell">
                <span className="detail-label">활동혜택</span>
                <span className="detail-value">{postData.details.benefits}</span>
              </div>
            </div>

            {/* 태그 섹션 */}
            <div className="detail-row full-width">
              <div className="detail-cell">
                <span className="detail-label">관심분야</span>
                <div className="tags-container">
                  {postData.tags.interest.map((tag, index) => (
                    <span key={index} className="tag interest-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-row full-width">
              <div className="detail-cell">
                <span className="detail-label">활동분야</span>
                <div className="tags-container">
                  {postData.tags.activity.map((tag, index) => (
                    <span key={index} className="tag activity-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="detail-row full-width">
              <div className="detail-cell">
                <span className="detail-label">추가혜택</span>
                <span className="detail-value highlight">{postData.details.additionalBenefits}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 액션 바 */}
      <div className="matching-detail-actions">
        <button className="action-btn apply-btn" onClick={handleApply}>
          홈페이지 지원
        </button>
        
        <button 
          className={`action-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={handleBookmark}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          <span>{postData.bookmarkCount}</span>
        </button>

        <div className="bookmarked-users">
          <div className="user-avatars">
            {postData.bookmarkedUsers.slice(0, 5).map((avatar, index) => (
              <img 
                key={index} 
                src={avatar} 
                alt="user" 
                className="user-avatar"
                style={{ zIndex: 5 - index }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchingDetail;
