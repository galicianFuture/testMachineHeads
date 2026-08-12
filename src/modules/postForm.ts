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

const FORM_OPENED = 'postForm/FORM_OPENED';
const FORM_LOADED = 'postForm/FORM_LOADED';
const SAVE_REQUESTED = 'postForm/SAVE_REQUESTED';
const FAILED = 'postForm/FAILED';

export interface PostFormState {
  authors: AuthorListItem[];
  tags: TagListItem[];
  post: PostDetail | null;
  loading: boolean;
  error: NormalizedError | null;
}

export const formOpened = (id: number | null) => ({ type: FORM_OPENED, payload: id }) as const;

export const saveRequested = (id: number | null, values: PostFormValues) =>
  ({ type: SAVE_REQUESTED, payload: { id, values } }) as const;

const formLoaded = (payload: Pick<PostFormState, 'authors' | 'tags' | 'post'>) =>
  ({ type: FORM_LOADED, payload }) as const;

const failed = (error: NormalizedError) => ({ type: FAILED, payload: error }) as const;

type PostFormAction =
  | ReturnType<typeof formOpened>
  | ReturnType<typeof saveRequested>
  | ReturnType<typeof formLoaded>
  | ReturnType<typeof failed>;

const initialState: PostFormState = {
  authors: [],
  tags: [],
  post: null,
  loading: false,
  error: null,
};

function reducer(state: PostFormState = initialState, action: PostFormAction): PostFormState {
  switch (action.type) {
    case FORM_OPENED:
      return { ...initialState, loading: true };

    case SAVE_REQUESTED:
      return { ...state, loading: true, error: null };

    case FORM_LOADED:
      return { ...state, loading: false, ...action.payload };

    case FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export const selectPostForm = (state: RootState) => state.postForm ?? initialState;

function* loadForm({ payload }: ReturnType<typeof formOpened>): SagaIterator {
  try {
    const [authors, tags]: [AuthorListItem[], TagListItem[]] = yield all([
      call(fetchAuthors),
      call(fetchTags),
    ]);
    const post: PostDetail | null = payload === null ? null : yield call(fetchPost, payload);

    yield put(formLoaded({ authors, tags, post }));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* savePost({ payload }: ReturnType<typeof saveRequested>): SagaIterator {
  const { id, values } = payload;

  try {
    if (id === null) {
      yield call(createPost, values);
    } else {
      yield call(updatePost, id, values);
    }

    yield put(push(ROUTES.posts));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* postFormSaga(): SagaIterator {
  yield takeLatest(FORM_OPENED, loadForm);
  yield takeLatest(SAVE_REQUESTED, savePost);
}

export const postFormModule: ISagaModule<Pick<DynamicState, 'postForm'>> = {
  id: 'postForm',
  reducerMap: {
    postForm: reducer as Reducer<PostFormState, AnyAction>,
  },
  sagas: [postFormSaga],
};
