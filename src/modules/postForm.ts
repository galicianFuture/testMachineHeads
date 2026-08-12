import type { SagaIterator } from 'redux-saga';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import type { AnyAction, Reducer } from 'redux';
import type { ISagaModule } from 'redux-dynamic-modules-saga';
import { fetchAuthors } from '@/api/authors.api';
import { createPost, fetchPost, updatePost } from '@/api/posts.api';
import { fetchTags } from '@/api/tags.api';
import { normalizeError, type NormalizedError } from '@/api/errors';
import type { AuthorListItem, PostDetail, PostFormValues, TagListItem } from '@/api/types';
import { ROUTES } from '@/routePaths';
import type { DynamicState, RootState } from '@/store/types';

export const FORM_OPENED = 'postForm/FORM_OPENED';
export const FORM_LOADED = 'postForm/FORM_LOADED';
export const SAVE_REQUESTED = 'postForm/SAVE_REQUESTED';
export const FORM_FAILED = 'postForm/FORM_FAILED';

export interface PostFormState {
  authors: AuthorListItem[];
  tags: TagListItem[];
  post: PostDetail | null;
  loading: boolean;
  saving: boolean;
  error: NormalizedError | null;
}

type LoadedPayload = Pick<PostFormState, 'authors' | 'tags' | 'post'>;

export const formOpened = (id: number | null) => ({ type: FORM_OPENED, payload: id }) as const;

export const formLoaded = (payload: LoadedPayload) => ({ type: FORM_LOADED, payload }) as const;

export const saveRequested = (id: number | null, values: PostFormValues) =>
  ({ type: SAVE_REQUESTED, payload: { id, values } }) as const;

export const formFailed = (error: NormalizedError) =>
  ({ type: FORM_FAILED, payload: error }) as const;

export type PostFormAction =
  | ReturnType<typeof formOpened>
  | ReturnType<typeof formLoaded>
  | ReturnType<typeof saveRequested>
  | ReturnType<typeof formFailed>;

const initialState: PostFormState = {
  authors: [],
  tags: [],
  post: null,
  loading: false,
  saving: false,
  error: null,
};

export function postFormReducer(
  state: PostFormState = initialState,
  action: PostFormAction,
): PostFormState {
  switch (action.type) {
    case FORM_OPENED:
      return { ...initialState, loading: true };

    case FORM_LOADED:
      return { ...state, loading: false, ...action.payload };

    case SAVE_REQUESTED:
      return { ...state, saving: true, error: null };

    case FORM_FAILED:
      return { ...state, loading: false, saving: false, error: action.payload };

    default:
      return state;
  }
}

export const selectPostForm = (state: RootState) => state.postForm ?? initialState;

function* loadForm(action: ReturnType<typeof formOpened>): SagaIterator {
  try {
    const [authors, tags]: [AuthorListItem[], TagListItem[]] = yield all([
      call(fetchAuthors),
      call(fetchTags),
    ]);
    const post: PostDetail | null =
      action.payload === null ? null : yield call(fetchPost, action.payload);

    yield put(formLoaded({ authors, tags, post }));
  } catch (error) {
    yield put(formFailed(normalizeError(error)));
  }
}

function* savePost({ payload }: ReturnType<typeof saveRequested>): SagaIterator {
  try {
    yield payload.id === null
      ? call(createPost, payload.values)
      : call(updatePost, payload.id, payload.values);

    yield put(push(ROUTES.posts));
  } catch (error) {
    yield put(formFailed(normalizeError(error)));
  }
}

export function* postFormSaga(): SagaIterator {
  yield takeLatest(FORM_OPENED, loadForm);
  yield takeLatest(SAVE_REQUESTED, savePost);
}

export const postFormModule: ISagaModule<Pick<DynamicState, 'postForm'>> = {
  id: 'postForm',
  reducerMap: {
    postForm: postFormReducer as Reducer<PostFormState, AnyAction>,
  },
  sagas: [postFormSaga],
};
