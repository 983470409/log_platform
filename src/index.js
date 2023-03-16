import '@babel/polyfill';
import dva from 'dva';
// import createLoading from 'dva-loading';
import { message } from 'antd';
// import './index.html';

import './resources/styles/common.less';
import './resources/styles/override-antd.less';
import './resources/styles/iconfont/iconfont.css';
import './resources/styles/iconfont/iconfont.js';

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
});

// 2. Plugins
// app.use(createLoading());

// 3. Model
// 1）只支持页面 model 的动态加载，全局 model 和模块 model 在此处直接引用加载
app.model(require('./model').default);
app.model(require('./components/layout/fullwrapper/model').default);

// 4. Router
app.router(require('./config/router').default);

// 5. Start
app.start('#root');
