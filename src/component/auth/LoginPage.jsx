import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 50;

function LoginPage() {
  const { login, completeSignup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/activities';
  const [error, setError] = useState(null);
  const [pendingSignup, setPendingSignup] = useState(null);
  const [nickname, setNickname] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

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
    if (nickname.trim().length < NICKNAME_MIN) {
      setError('닉네임은 2자 이상 입력해주세요.');
      return;
    }
    setSignupLoading(true);
    try {
      await completeSignup(pendingSignup.idToken, nickname.trim());
      navigate(redirect);
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  // 닉네임 입력 단계 (신규 회원)
  if (pendingSignup) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>닉네임 설정</h1>
          <p className="login-description">
            사용할 닉네임을 입력해주세요. ({NICKNAME_MIN}~{NICKNAME_MAX}자)
          </p>
          {error && (
            <div className="login-error">
              {error}
              <button type="button" className="login-error-close" onClick={() => setError(null)} aria-label="닫기">&times;</button>
            </div>
          )}
          <form onSubmit={handleSignupSubmit} noValidate>
            <div className="login-nickname-group">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                minLength={NICKNAME_MIN}
                maxLength={NICKNAME_MAX}
                className="login-nickname-input"
                autoFocus
              />
              <span className="login-nickname-counter">{nickname.length}/{NICKNAME_MAX}</span>
            </div>
            <div className="login-actions">
              <button type="submit" className="login-submit" disabled={signupLoading}>
                {signupLoading ? '가입 중...' : '가입 완료'}
              </button>
              <button
                type="button"
                className="login-back"
                disabled={signupLoading}
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
        {error && (
          <div className="login-error">
            {error}
            <button type="button" className="login-error-close" onClick={() => setError(null)} aria-label="닫기">&times;</button>
          </div>
        )}
        {clientId ? (
          <div className="login-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="filled_blue"
              size="large"
              text="continue_with"
              shape="rectangular"
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
