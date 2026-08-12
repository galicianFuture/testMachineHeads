import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import 'antd/dist/reset.css';
import './index.css';
import App from './App';
import { setAuthAdapter } from './api/client';
import { sessionEnded } from './modules/auth';
import { clearTokens, getAccessToken, isAccessTokenExpiring, refreshSession } from './session';
import { history, store } from './store';

setAuthAdapter({
  getAccessToken,
  isAccessTokenExpiring,
  refresh: refreshSession,
  onAuthFailure: () => {
    clearTokens();
    store.dispatch(sessionEnded());
  },
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ConfigProvider locale={ruRU}>
        <App />
      </ConfigProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
