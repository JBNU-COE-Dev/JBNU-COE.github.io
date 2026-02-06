import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/activities';
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    try {
      const idToken = credentialResponse.credential;
      await login(idToken);
      navigate(redirect);
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
    }
  };

  const handleGoogleError = () => {
    setError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
  };

  const clientId = '817276821213-usk2qqqca7ijmlvjvdt99hsbagnl6b20.apps.googleusercontent.com';

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
