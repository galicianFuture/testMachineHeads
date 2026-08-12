import { connectRouter, type RouterState } from 'connected-react-router';
import type { History } from 'history';
import type { AnyAction, Reducer } from 'redux';
import type { IModule } from 'redux-dynamic-modules-core';
import type { RootState } from './types';

export function getRootModule(history: History): IModule<RootState> {
  return {
    id: 'root',
    retained: true,
    reducerMap: {
      router: connectRouter(history) as Reducer<RouterState, AnyAction>,
    },
  };
}
