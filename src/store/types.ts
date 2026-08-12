import type { RouterState } from 'connected-react-router';
import type { AnyAction, Dispatch } from 'redux';
import type { AuthState } from '@/modules/auth';

export interface CoreState {
  router: RouterState;
  auth: AuthState;
}

export interface DynamicState {}

export type RootState = CoreState & Partial<DynamicState>;

export type AppDispatch = Dispatch<AnyAction>;
