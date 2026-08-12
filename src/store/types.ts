import type { RouterState } from 'connected-react-router';
import type { AnyAction, Dispatch } from 'redux';
import type { AuthState } from '@/modules/auth';
import type { AuthorsState } from '@/modules/authors';
import type { PostFormState } from '@/modules/postForm';
import type { PostsState } from '@/modules/posts';
import type { TagsState } from '@/modules/tags';

export interface CoreState {
  router: RouterState;
  auth: AuthState;
}

export interface DynamicState {
  posts: PostsState;
  postForm: PostFormState;
  authors: AuthorsState;
  tags: TagsState;
}

export type RootState = CoreState & Partial<DynamicState>;

export type AppDispatch = Dispatch<AnyAction>;
