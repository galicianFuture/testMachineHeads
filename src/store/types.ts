import type { RouterState } from 'connected-react-router';
import type { AnyAction, Dispatch } from 'redux';

export interface CoreState {
  router: RouterState;
}

export interface DynamicState {}

export type RootState = CoreState & Partial<DynamicState>;

export type AppDispatch = Dispatch<AnyAction>;
