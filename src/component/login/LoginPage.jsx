import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const DEFAULT_REDIRECT = '/activities';

/** 내부 경로만 허용 (오픈 리다이렉트 방지) */
function getSafeRedirect(value) {
  if (!value || typeof value !== 'string') return DEFAULT_REDIRECT;
  if (!value.startsWith('/') || value.startsWith('//')) return DEFAULT_REDIRECT;
  return value;
}

function LoginPage() {
  const { login, completeSignup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = getSafeRedirect(searchParams.get('redirect'));
  const [error, setError] = useState(null);
  const [pendingSignup, setPendingSignup] = useState(null); // { idToken, email }
  const [nickname, setNickname] = useState('');
  const [googleBtnWidth, setGoogleBtnWidth] = useState(300);
  const googleResizeObserverRef = useRef(null);

  // Google 로그인 버튼은 고정 px 폭으로 그려지므로, 실제 컨테이너 폭을
  // 측정해 width prop으로 넘겨줘야 화면 크기별로 올바르게 렌더링된다.
  // isLoading이 풀리기 전까지는 컴포넌트가 null을 반환해 이 wrap이
  // 나중에야 마운트되므로, effect 대신 콜백 ref로 실제 마운트 시점에 관찰한다.
  const googleWrapRef = useCallback((node) => {
    if (googleResizeObserverRef.current) {
      googleResizeObserverRef.current.disconnect();
      googleResizeObserverRef.current = null;
    }
    if (!node) return;
    const updateWidth = () => {
      const width = node.getBoundingClientRect().width;
      if (width > 0) {
        setGoogleBtnWidth(Math.round(Math.min(400, Math.max(240, width))));
      }
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    googleResizeObserverRef.current = observer;
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !pendingSignup) {
      navigate(redirect, { replace: true });
    }
  }, [isLoading, isAuthenticated, pendingSignup, navigate, redirect]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    try {
      const idToken = credentialResponse.credential;
      const data = await login(idToken);
      if (data.needSignup) {
        setPendingSignup({ idToken, email: data.email });
        return;
      }
      navigate(redirect);
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!pendingSignup || !nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    if (nickname.trim().length < 2) {
      setError('닉네임은 2자 이상 입력해주세요.');
      return;
    }
    try {
      await completeSignup(pendingSignup.idToken, nickname.trim());
      navigate(redirect);
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    }
  };

  const handleGoogleError = () => {
    setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  if (isLoading || (isAuthenticated && !pendingSignup)) {
    return null;
  }

  // 닉네임 입력 단계 (신규 회원)
  if (pendingSignup) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>닉네임 설정</h1>
          <p className="login-description">
            사용할 닉네임을 입력해주세요. (2~50자)
          </p>
          {pendingSignup.email && (
            <p className="login-email">{pendingSignup.email}</p>
          )}
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSignupSubmit}>
            <div className="login-nickname-group">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                minLength={2}
                maxLength={50}
                className="login-nickname-input"
                autoFocus
              />
            </div>
            <div className="login-actions">
              <button type="submit" className="login-submit">
                가입 완료
              </button>
              <button
                type="button"
                className="login-back"
                onClick={() => {
                  setPendingSignup(null);
                  setNickname('');
                  setError(null);
                }}
              >
                이전으로
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>로그인 / 회원가입</h1>
        <p className="login-description">
          전북대학교 웹메일(@jbnu.ac.kr)로만 로그인할 수 있습니다.
          <br />
          팀원 모집 글 작성 등에 로그인이 필요합니다.
        </p>
        {error && <div className="login-error">{error}</div>}
        {clientId ? (
          <div className="login-google-wrap" ref={googleWrapRef}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="filled_blue"
              size="large"
              text="continue_with"
              shape="rectangular"
              width={googleBtnWidth}
            />
          </div>
        ) : (
          <div className="login-no-client">
            Google 로그인 설정이 필요합니다. REACT_APP_GOOGLE_CLIENT_ID를 설정해주세요.
          </div>
        )}
        <button type="button" className="login-back" onClick={() => navigate(-1)}>
          이전으로
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
