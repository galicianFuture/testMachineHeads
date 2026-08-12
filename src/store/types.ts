import type { RouterState } from 'connected-react-router';
import type { AnyAction, Dispatch } from 'redux';
import type { AuthState } from '@/modules/auth';
import type { PostsState } from '@/modules/posts';

export interface CoreState {
  router: RouterState;
  auth: AuthState;
}

export interface DynamicState {
  posts: PostsState;
}

export type RootState = CoreState & Partial<DynamicState>;

export type AppDispatch = Dispatch<AnyAction>;
