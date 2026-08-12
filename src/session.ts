import Cookies from 'js-cookie';
import { refreshToken } from '@/api/auth.api';
import type { TokenPair } from '@/api/types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_EXPIRED_AT_KEY = 'access_expired_at';

const REFRESH_THRESHOLD_MS = 30_000;

export function saveTokens(pair: TokenPair): void {
  const options: Cookies.CookieAttributes = {
    expires: new Date(pair.refresh_expired_at * 1000),
    path: '/',
    sameSite: 'strict',
    secure: import.meta.env.PROD,
  };

  Cookies.set(ACCESS_TOKEN_KEY, pair.access_token, options);
  Cookies.set(REFRESH_TOKEN_KEY, pair.refresh_token, options);
  Cookies.set(ACCESS_EXPIRED_AT_KEY, String(pair.access_expired_at), options);
}

export function clearTokens(): void {
  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ACCESS_EXPIRED_AT_KEY].forEach((key) => {
    Cookies.remove(key, { path: '/' });
  });
}

export function getAccessToken(): string | null {
  return Cookies.get(ACCESS_TOKEN_KEY) ?? null;
}

export function hasSession(): boolean {
  return Cookies.get(REFRESH_TOKEN_KEY) !== undefined;
}

export function isAccessTokenExpiring(): boolean {
  if (getAccessToken() === null) return true;

  const expiredAt = Number(Cookies.get(ACCESS_EXPIRED_AT_KEY));
  if (!Number.isFinite(expiredAt) || expiredAt === 0) return true;

  return expiredAt * 1000 - Date.now() < REFRESH_THRESHOLD_MS;
}

let pendingRefresh: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const token = Cookies.get(REFRESH_TOKEN_KEY);
  if (token === undefined) return null;

  try {
    const pair = await refreshToken(token);
    saveTokens(pair);
    return pair.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

export function refreshSession(): Promise<string | null> {
  if (pendingRefresh === null) {
    pendingRefresh = performRefresh().finally(() => {
      pendingRefresh = null;
    });
  }

  return pendingRefresh;
}
