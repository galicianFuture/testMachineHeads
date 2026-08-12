import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import 'antd/dist/reset.css';
import './index.css';
import App from './App';

ReactDOM.render(
  <ConfigProvider locale={ruRU}>
    <App />
  </ConfigProvider>,
  document.getElementById('root'),
);
