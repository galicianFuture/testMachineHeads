import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import type { AnyAction, Reducer } from 'redux';
import type { ISagaModule } from 'redux-dynamic-modules-saga';
import { fetchPosts } from '@/api/posts.api';
import { normalizeError, type NormalizedError } from '@/api/errors';
import type { PaginatedResult, Pagination, PostListItem } from '@/api/types';
import type { DynamicState, RootState } from '@/store/types';

export const POSTS_REQUESTED = 'posts/POSTS_REQUESTED';
export const POSTS_LOADED = 'posts/POSTS_LOADED';
export const POSTS_FAILED = 'posts/POSTS_FAILED';

export const postsRequested = (page: number) => ({ type: POSTS_REQUESTED, payload: page }) as const;

export const postsLoaded = (result: PaginatedResult<PostListItem>) =>
  ({ type: POSTS_LOADED, payload: result }) as const;

export const postsFailed = (error: NormalizedError) =>
  ({ type: POSTS_FAILED, payload: error }) as const;

export type PostsAction =
  | ReturnType<typeof postsRequested>
  | ReturnType<typeof postsLoaded>
  | ReturnType<typeof postsFailed>;

export interface PostsState {
  items: PostListItem[];
  pagination: Pagination;
  loading: boolean;
  error: NormalizedError | null;
}

const initialState: PostsState = {
  items: [],
  pagination: { currentPage: 1, pageCount: 1, perPage: 9, totalCount: 0 },
  loading: false,
  error: null,
};

export function postsReducer(state: PostsState = initialState, action: PostsAction): PostsState {
  switch (action.type) {
    case POSTS_REQUESTED:
      return { ...state, loading: true, error: null };

    case POSTS_LOADED:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        pagination: action.payload.pagination,
      };

    case POSTS_FAILED:
      return { ...state, loading: false, items: [], error: action.payload };

    default:
      return state;
  }
}

export const selectPosts = (state: RootState) => state.posts ?? initialState;

function* loadPosts(action: ReturnType<typeof postsRequested>): SagaIterator {
  try {
    const result: PaginatedResult<PostListItem> = yield call(fetchPosts, action.payload);
    yield put(postsLoaded(result));
  } catch (error) {
    yield put(postsFailed(normalizeError(error)));
  }
}

export function* postsSaga(): SagaIterator {
  yield takeLatest(POSTS_REQUESTED, loadPosts);
}

export const postsModule: ISagaModule<DynamicState> = {
  id: 'posts',
  reducerMap: {
    posts: postsReducer as Reducer<PostsState, AnyAction>,
  },
  sagas: [postsSaga],
};
