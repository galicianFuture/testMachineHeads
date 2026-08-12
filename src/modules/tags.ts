import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import type { AnyAction, Reducer } from 'redux';
import type { ISagaModule } from 'redux-dynamic-modules-saga';
import { createTag, deleteTag, deleteTags, fetchTag, fetchTags, updateTag } from '@/api/tags.api';
import { normalizeError, type NormalizedError } from '@/api/errors';
import type { TagDetail, TagFormValues, TagListItem } from '@/api/types';
import { ROUTES } from '@/routePaths';
import type { DynamicState, RootState } from '@/store/types';

const TAGS_REQUESTED = 'tags/TAGS_REQUESTED';
const TAGS_LOADED = 'tags/TAGS_LOADED';
const TAG_OPENED = 'tags/TAG_OPENED';
const TAG_LOADED = 'tags/TAG_LOADED';
const SAVE_REQUESTED = 'tags/SAVE_REQUESTED';
const DELETE_REQUESTED = 'tags/DELETE_REQUESTED';
const SAVED = 'tags/SAVED';
const FAILED = 'tags/FAILED';

export const tagsRequested = () => ({ type: TAGS_REQUESTED }) as const;

export const tagOpened = (id: number | null) => ({ type: TAG_OPENED, payload: id }) as const;

export const saveRequested = (id: number | null, values: TagFormValues) =>
  ({ type: SAVE_REQUESTED, payload: { id, values } }) as const;

export const deleteRequested = (ids: number[]) =>
  ({ type: DELETE_REQUESTED, payload: ids }) as const;

const tagsLoaded = (items: TagListItem[]) => ({ type: TAGS_LOADED, payload: items }) as const;

const tagLoaded = (tag: TagDetail | null) => ({ type: TAG_LOADED, payload: tag }) as const;

const saved = () => ({ type: SAVED }) as const;

const failed = (error: NormalizedError) => ({ type: FAILED, payload: error }) as const;

type TagsAction =
  | ReturnType<typeof tagsRequested>
  | ReturnType<typeof tagOpened>
  | ReturnType<typeof saveRequested>
  | ReturnType<typeof deleteRequested>
  | ReturnType<typeof tagsLoaded>
  | ReturnType<typeof tagLoaded>
  | ReturnType<typeof saved>
  | ReturnType<typeof failed>;

export interface TagsState {
  items: TagListItem[];
  tag: TagDetail | null;
  loading: boolean;
  error: NormalizedError | null;
}

const initialState: TagsState = { items: [], tag: null, loading: false, error: null };

function reducer(state: TagsState = initialState, action: TagsAction): TagsState {
  switch (action.type) {
    case TAGS_REQUESTED:
    case SAVE_REQUESTED:
    case DELETE_REQUESTED:
      return { ...state, loading: true, error: null };

    case TAG_OPENED:
      return { ...initialState, loading: true };

    case TAGS_LOADED:
      return { ...state, loading: false, items: action.payload };

    case TAG_LOADED:
      return { ...state, loading: false, tag: action.payload };

    case SAVED:
      return { ...state, loading: false };

    case FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export const selectTags = (state: RootState) => state.tags ?? initialState;

function* loadTags(): SagaIterator {
  try {
    const items: TagListItem[] = yield call(fetchTags);
    yield put(tagsLoaded(items));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* loadTag({ payload }: ReturnType<typeof tagOpened>): SagaIterator {
  if (payload === null) {
    yield put(tagLoaded(null));
    return;
  }

  try {
    const tag: TagDetail = yield call(fetchTag, payload);
    yield put(tagLoaded(tag));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* saveTag({ payload }: ReturnType<typeof saveRequested>): SagaIterator {
  const { id, values } = payload;

  try {
    if (id === null) {
      yield call(createTag, values);
    } else {
      yield call(updateTag, id, values);
    }

    yield put(saved());
    yield put(push(ROUTES.tags));
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* removeTags({ payload }: ReturnType<typeof deleteRequested>): SagaIterator {
  try {
    if (payload.length === 1) {
      yield call(deleteTag, payload[0]);
    } else {
      yield call(deleteTags, payload);
    }

    yield put(tagsRequested());
  } catch (error) {
    yield put(failed(normalizeError(error)));
  }
}

function* tagsSaga(): SagaIterator {
  yield takeLatest(TAGS_REQUESTED, loadTags);
  yield takeLatest(TAG_OPENED, loadTag);
  yield takeLatest(SAVE_REQUESTED, saveTag);
  yield takeLatest(DELETE_REQUESTED, removeTags);
}

export const tagsModule: ISagaModule<Pick<DynamicState, 'tags'>> = {
  id: 'tags',
  reducerMap: {
    tags: reducer as Reducer<TagsState, AnyAction>,
  },
  sagas: [tagsSaga],
};
