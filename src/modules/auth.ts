import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { fetchProfile, generateToken, type Credentials } from '@/api/auth.api';
import { normalizeError, type NormalizedError } from '@/api/errors';
import type { Profile, TokenPair } from '@/api/types';
import { clearTokens, hasSession, saveTokens } from '@/session';
import { ROUTES } from '@/routePaths';
import type { RootState } from '@/store/types';

export const SESSION_ESTABLISHED = 'auth/SESSION_ESTABLISHED';
export const SESSION_ENDED = 'auth/SESSION_ENDED';
export const LOGIN_REQUESTED = 'auth/LOGIN_REQUESTED';
export const LOGIN_FAILED = 'auth/LOGIN_FAILED';
export const LOGOUT_REQUESTED = 'auth/LOGOUT_REQUESTED';

export const sessionEstablished = (profile: Profile) =>
  ({ type: SESSION_ESTABLISHED, payload: profile }) as const;

export const sessionEnded = () => ({ type: SESSION_ENDED }) as const;

export const loginRequested = (credentials: Credentials) =>
  ({ type: LOGIN_REQUESTED, payload: credentials }) as const;

export const loginFailed = (error: NormalizedError) =>
  ({ type: LOGIN_FAILED, payload: error }) as const;

export const logoutRequested = () => ({ type: LOGOUT_REQUESTED }) as const;

export type AuthAction =
  | ReturnType<typeof sessionEstablished>
  | ReturnType<typeof sessionEnded>
  | ReturnType<typeof loginRequested>
  | ReturnType<typeof loginFailed>
  | ReturnType<typeof logoutRequested>;

export interface AuthState {
  status: 'unknown' | 'authenticated' | 'anonymous';
  profile: Profile | null;
  loginPending: boolean;
  loginError: NormalizedError | null;
}

const initialState: AuthState = {
  status: 'unknown',
  profile: null,
  loginPending: false,
  loginError: null,
};

export function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return { ...state, loginPending: true, loginError: null };

    case SESSION_ESTABLISHED:
      return { ...state, status: 'authenticated', profile: action.payload, loginPending: false };

    case LOGIN_FAILED:
      return { ...state, status: 'anonymous', loginPending: false, loginError: action.payload };

    case SESSION_ENDED:
      return { ...initialState, status: 'anonymous' };

    default:
      return state;
  }
}

export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectProfile = (state: RootState) => state.auth.profile;
export const selectLoginPending = (state: RootState) => state.auth.loginPending;
export const selectLoginError = (state: RootState) => state.auth.loginError;

function* restoreSession(): SagaIterator {
  if (!hasSession()) {
    yield put(sessionEnded());
    return;
  }

  try {
    const profile: Profile = yield call(fetchProfile);
    yield put(sessionEstablished(profile));
  } catch {
    yield call(clearTokens);
    yield put(sessionEnded());
  }
}

function* login(action: ReturnType<typeof loginRequested>): SagaIterator {
  try {
    const pair: TokenPair = yield call(generateToken, action.payload);
    yield call(saveTokens, pair);

    const profile: Profile = yield call(fetchProfile);
    yield put(sessionEstablished(profile));
  } catch (error) {
    yield call(clearTokens);
    yield put(loginFailed(normalizeError(error)));
  }
}

function* logout(): SagaIterator {
  yield call(clearTokens);
  yield put(sessionEnded());
  yield put(push(ROUTES.login));
}

export function* authSaga(): SagaIterator {
  yield takeLatest(LOGIN_REQUESTED, login);
  yield takeLatest(LOGOUT_REQUESTED, logout);
  yield call(restoreSession);
}
