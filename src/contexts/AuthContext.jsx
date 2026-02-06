import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AUTH_TOKEN_KEY = 'authToken';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .verifyToken()
      .then((data) => {
        if (data?.valid && data?.username) {
          setIsAuthenticated(true);
          setUserEmail(data.username);
          setUserNickname(data.nickname || null);
        } else {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (idToken) => {
    const data = await authApi.googleLogin(idToken);
    if (data.needSignup) {
      return data; // { needSignup: true, email } - 호출자가 닉네임 입력 처리
    }
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    setIsAuthenticated(true);
    setUserEmail(data.username);
    setUserNickname(data.nickname || null);
    return data;
  };

  const completeSignup = async (idToken, nickname) => {
    const data = await authApi.signup(idToken, nickname);
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    setIsAuthenticated(true);
    setUserEmail(data.username);
    setUserNickname(data.nickname || null);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserNickname(null);
    authApi.logout().catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userNickname,
        isLoading,
        login,
        completeSignup,
        logout,
        hasToken: () => !!localStorage.getItem(AUTH_TOKEN_KEY),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
