import { configureStore } from './configureStore';
import { history } from './history';

export const store = configureStore(history);

export { history };
export { useAppDispatch, useAppSelector } from './hooks';
export type { AppDispatch, CoreState, DynamicState, RootState } from './types';
