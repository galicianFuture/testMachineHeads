import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';


declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    _retry?: boolean;
  }
}

export interface AuthAdapter {
  getAccessToken(): string | null;
  isAccessTokenExpiring(): boolean;
  refresh(reason: 'expiring' | 'unauthorized'): Promise<string | null>;
  onAuthFailure(): void;
}

const anonymousAdapter: AuthAdapter = {
  getAccessToken: () => null,
  isAccessTokenExpiring: () => false,
  refresh: async () => null,
  onAuthFailure: () => undefined,
};

let authAdapter: AuthAdapter = anonymousAdapter;

export function setAuthAdapter(adapter: AuthAdapter): void {
  authAdapter = adapter;
}

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
});

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.skipAuth) return config;

  const token = authAdapter.isAccessTokenExpiring()
    ? await authAdapter.refresh('expiring')
    : authAdapter.getAccessToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig | undefined;

    if (error.response?.status !== 401 || !config || config.skipAuth || config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;
    const token = await authAdapter.refresh('unauthorized');

    if (!token) {
      authAdapter.onAuthFailure();
      return Promise.reject(error);
    }

    config.headers.set('Authorization', `Bearer ${token}`);
    return client.request(config);
  },
);
