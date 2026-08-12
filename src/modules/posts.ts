import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import type { AnyAction, Reducer } from 'redux';
import type { ISagaModule } from 'redux-dynamic-modules-saga';
import { deletePost, fetchPosts } from '@/api/posts.api';
import { normalizeError, type NormalizedError } from '@/api/errors';
import type { PaginatedResult, Pagination, PostListItem } from '@/api/types';
import type { DynamicState, RootState } from '@/store/types';

const POSTS_REQUESTED = 'posts/POSTS_REQUESTED';
const POSTS_LOADED = 'posts/POSTS_LOADED';
const DELETE_REQUESTED = 'posts/DELETE_REQUESTED';
const FAILED = 'posts/FAILED';

export const postsRequested = (page: number) => ({ type: POSTS_REQUESTED, payload: page }) as const;

export const postDeleteRequested = (id: number, page: number) =>
  ({ type: DELETE_REQUESTED, payload: { id, page } }) as const;

const postsLoaded = (result: PaginatedResult<PostListItem>) =>
  ({ type: POSTS_LOADED, payload: result }) as const;

const failed = (error: NormalizedError) => ({ type: FAILED, payload: error }) as const;

type PostsAction =
  | ReturnType<typeof postsRequested>
  | ReturnType<typeof postDeleteRequested>
  | ReturnType<typeof postsLoaded>
  | ReturnType<typeof failed>;

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

function reducer(state: PostsState = initialState, action: PostsAction): PostsState {
  switch (action.type) {
    case POSTS_REQUESTED:
    case DELETE_REQUESTED:
      return { ...state, loading: true, error: null };

    case POSTS_LOADED:
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        pagination: action.payload.pagination,
      };

    case FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export const selectPosts = (state: RootState) => state.posts ?? initialState;

function* loadPosts({ payload }: ReturnType<typeof postsRequested>): SagaIterator {
  try {
    const result: PaginatedResult<PostListItem> = yield call(fetchPosts, payload);
    yield put(postsLoaded(result));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* removePost({ payload }: ReturnType<typeof postDeleteRequested>): SagaIterator {
  try {
    yield call(deletePost, payload.id);
    yield put(postsRequested(payload.page));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* postsSaga(): SagaIterator {
  yield takeLatest(POSTS_REQUESTED, loadPosts);
  yield takeLatest(DELETE_REQUESTED, removePost);
}

export const postsModule: ISagaModule<Pick<DynamicState, 'posts'>> = {
  id: 'posts',
  reducerMap: {
    posts: reducer as Reducer<PostsState, AnyAction>,
  },
  sagas: [postsSaga],
};
