import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import type { AnyAction, Reducer } from 'redux';
import type { ISagaModule } from 'redux-dynamic-modules-saga';
import {
  createAuthor,
  deleteAuthor,
  deleteAuthors,
  fetchAuthor,
  fetchAuthors,
  updateAuthor,
} from '@/api/authors.api';
import { normalizeError, type NormalizedError } from '@/api/errors';
import type { AuthorDetail, AuthorFormValues, AuthorListItem } from '@/api/types';
import { ROUTES } from '@/routePaths';
import type { DynamicState, RootState } from '@/store/types';

const AUTHORS_REQUESTED = 'authors/AUTHORS_REQUESTED';
const AUTHORS_LOADED = 'authors/AUTHORS_LOADED';
const AUTHOR_OPENED = 'authors/AUTHOR_OPENED';
const AUTHOR_LOADED = 'authors/AUTHOR_LOADED';
const SAVE_REQUESTED = 'authors/SAVE_REQUESTED';
const DELETE_REQUESTED = 'authors/DELETE_REQUESTED';
const SAVED = 'authors/SAVED';
const FAILED = 'authors/FAILED';

export const authorsRequested = () => ({ type: AUTHORS_REQUESTED }) as const;

export const authorOpened = (id: number | null) => ({ type: AUTHOR_OPENED, payload: id }) as const;

export const saveRequested = (id: number | null, values: AuthorFormValues) =>
  ({ type: SAVE_REQUESTED, payload: { id, values } }) as const;

export const deleteRequested = (ids: number[]) =>
  ({ type: DELETE_REQUESTED, payload: ids }) as const;

const authorsLoaded = (items: AuthorListItem[]) =>
  ({ type: AUTHORS_LOADED, payload: items }) as const;

const authorLoaded = (author: AuthorDetail | null) =>
  ({ type: AUTHOR_LOADED, payload: author }) as const;

const saved = () => ({ type: SAVED }) as const;

const failed = (error: NormalizedError) => ({ type: FAILED, payload: error }) as const;

type AuthorsAction =
  | ReturnType<typeof authorsRequested>
  | ReturnType<typeof authorOpened>
  | ReturnType<typeof saveRequested>
  | ReturnType<typeof deleteRequested>
  | ReturnType<typeof authorsLoaded>
  | ReturnType<typeof authorLoaded>
  | ReturnType<typeof saved>
  | ReturnType<typeof failed>;

export interface AuthorsState {
  items: AuthorListItem[];
  author: AuthorDetail | null;
  loading: boolean;
  error: NormalizedError | null;
}

const initialState: AuthorsState = { items: [], author: null, loading: false, error: null };

function reducer(state: AuthorsState = initialState, action: AuthorsAction): AuthorsState {
  switch (action.type) {
    case AUTHORS_REQUESTED:
    case SAVE_REQUESTED:
    case DELETE_REQUESTED:
      return { ...state, loading: true, error: null };

    case AUTHOR_OPENED:
      return { ...initialState, loading: true };

    case AUTHORS_LOADED:
      return { ...state, loading: false, items: action.payload };

    case AUTHOR_LOADED:
      return { ...state, loading: false, author: action.payload };

    case SAVED:
      return { ...state, loading: false };

    case FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export const selectAuthors = (state: RootState) => state.authors ?? initialState;

export const authorFullName = (author: AuthorListItem) =>
  [author.lastName, author.name, author.secondName].filter(Boolean).join(' ');

function* loadAuthors(): SagaIterator {
  try {
    const items: AuthorListItem[] = yield call(fetchAuthors);
    yield put(authorsLoaded(items));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* loadAuthor({ payload }: ReturnType<typeof authorOpened>): SagaIterator {
  if (payload === null) {
    yield put(authorLoaded(null));
    return;
  }

  try {
    const author: AuthorDetail = yield call(fetchAuthor, payload);
    yield put(authorLoaded(author));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* saveAuthor({ payload }: ReturnType<typeof saveRequested>): SagaIterator {
  const { id, values } = payload;

  try {
    if (id === null) {
      yield call(createAuthor, values);
    } else {
      yield call(updateAuthor, id, values);
    }

    yield put(saved());
    yield put(push(ROUTES.authors));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* removeAuthors({ payload }: ReturnType<typeof deleteRequested>): SagaIterator {
  try {
    if (payload.length === 1) {
      yield call(deleteAuthor, payload[0]);
    } else {
      yield call(deleteAuthors, payload);
    }

    yield put(authorsRequested());
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* authorsSaga(): SagaIterator {
  yield takeLatest(AUTHORS_REQUESTED, loadAuthors);
  yield takeLatest(AUTHOR_OPENED, loadAuthor);
  yield takeLatest(SAVE_REQUESTED, saveAuthor);
  yield takeLatest(DELETE_REQUESTED, removeAuthors);
}

export const authorsModule: ISagaModule<Pick<DynamicState, 'authors'>> = {
  id: 'authors',
  reducerMap: {
    authors: reducer as Reducer<AuthorsState, AnyAction>,
  },
  sagas: [authorsSaga],
};
