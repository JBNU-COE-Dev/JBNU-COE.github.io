/**
 * 인증 API (Google OAuth - @jbnu.ac.kr 전용)
 */
import { get, post } from './api';

const AUTH_BASE = '/api/auth';

/**
 * Google ID 토큰으로 로그인
 * @param {string} idToken - Google Sign-In에서 받은 credential
 * @returns {Promise<{token: string, username: string}>}
 */
export async function googleLogin(idToken) {
  return post(`${AUTH_BASE}/google`, { idToken });
}

/**
 * 토큰 검증
 * @returns {Promise<{valid: boolean, username: string}>}
 */
export async function verifyToken() {
  return get(`${AUTH_BASE}/verify`);
}

/**
 * 회원가입 완료 (닉네임 저장)
 * @param {string} idToken - Google ID 토큰
 * @param {string} nickname - 닉네임 (2~50자)
 */
export async function signup(idToken, nickname) {
  return post(`${AUTH_BASE}/signup`, { idToken, nickname });
}

/**
 * 로그아웃
 */
export async function logout() {
  return post(`${AUTH_BASE}/logout`);
}

export const authApi = {
  googleLogin,
  signup,
  verifyToken,
  logout,
};
