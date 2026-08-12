import { client } from './client';
import { toFormData } from './formData';
import type { Profile, TokenPair } from './types';

export interface Credentials {
  email: string;
  password: string;
}

export async function generateToken({ email, password }: Credentials): Promise<TokenPair> {
  const { data } = await client.post<TokenPair>(
    '/auth/token-generate',
    toFormData({ email, password }),
    { skipAuth: true },
  );
  return data;
}

export async function refreshToken(refresh_token: string): Promise<TokenPair> {
  const { data } = await client.post('/auth/token-refresh', toFormData({ refresh_token }), {
    skipAuth: true,
  });
  return data;
}

export async function fetchProfile(): Promise<Profile> {
  const { data } = await client.get('/profile');
  return data;
}
