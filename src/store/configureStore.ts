import { applyMiddleware } from 'redux';
import { createStore, type IModuleStore } from 'redux-dynamic-modules-core';
import { getSagaExtension } from 'redux-dynamic-modules-saga';
import { routerMiddleware } from 'connected-react-router';
import type { History } from 'history';
import { getRootModule } from './rootModule';
import type { RootState } from './types';

export function configureStore(history: History): IModuleStore<RootState> {
  return createStore<RootState>(
    {
      enhancers: [applyMiddleware(routerMiddleware(history))],
      extensions: [getSagaExtension()],
    },
    getRootModule(history),
  );
}
