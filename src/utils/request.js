import fetch from 'dva/fetch';
import { message } from 'antd';
import { createHashHistory } from 'history';
import * as Utils from './utils';
import { DOMAIN } from '../config/constant/constant';

const history = createHashHistory();

// 初始化loading队列
if (typeof window.HC_LOADING_QUEUE == 'undefined') {
  window.HC_LOADING_QUEUE = [];
}
if (typeof window.HC_STATUS_REDIRECT == 'undefined') {
  window.HC_STATUS_REDIRECT = false;
}

/**
 * post请求封装函数
 * @param url
 * @param param
 * @returns {{}}
 */
export async function post(url = '', param = {}, showLoading = true, showError = true) {
  const CONSTANT_CONFIG = window.CONSTANT_CONFIG || {};
  const queryStr = Utils.jsonToQueryString(CONSTANT_CONFIG);
  const body = Utils.jsonToQueryString({
    ...param,
  });
  let data = {};
  let response;
  if (showLoading) {
    if (window.HC_LOADING_QUEUE.length <= 0) {
      message.loading('加载中', 0);
    }

    window.HC_LOADING_QUEUE.push('');
  }

  try {
    response = await fetch(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`, {
      body,
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
  } catch (e) {
    console.log(e);
    if (window.STATUS_REDIRECT) {
      await Utils.sleep(3000);
    }

    response = {
      status: 500,
      statusText: '请求失败，请检查您的网络是否正常',
    };
  }

  if (showLoading) {
    window.HC_LOADING_QUEUE.pop();

    if (window.HC_LOADING_QUEUE.length <= 0) {
      message.destroy();
    }
  }

  if (response.status >= 200 && response.status < 300) {
    try {
      data = await response.json();
    } catch (e) {
      data = {
        code: 1001,
        msg: '响应数据语法错误',
      };
    }
  } else {
    data = {
      code: 1000,
      msg: `抱歉，请求失败，请检查网络后重试 (CODE:${response.status})`,
    };
  }

  if (data.code == 999) {
    // 添加登录失效的处理代码
    history.replace('/login');

    // sleep等待
    await Utils.sleep(10000);
  }
  if (showError && data.code !== 0 && data.code !== 998 && data.code !== 999) {
    await message.error(data.msg, 1.5);
  }

  return data;
}

/**
 * post请求封装函数
 * @param url
 * @param param
 * @returns {{}}
 */
export async function postJson(url = '', param = {}, showLoading = true, showError = true) {
  const CONSTANT_CONFIG = window.CONSTANT_CONFIG || {};
  const queryStr = Utils.jsonToQueryString(CONSTANT_CONFIG);
  const body = JSON.stringify(param);
  let data = {};
  let response;
  if (showLoading) {
    if (window.HC_LOADING_QUEUE.length <= 0) {
      message.loading('加载中', 0);
    }

    window.HC_LOADING_QUEUE.push('');
  }

  try {
    response = await fetch(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`, {
      body,
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
  } catch (e) {
    console.log(e);
    if (window.STATUS_REDIRECT) {
      await Utils.sleep(3000);
    }

    response = {
      status: 500,
      statusText: '请求失败，请检查您的网络是否正常',
    };
  }

  if (showLoading) {
    window.HC_LOADING_QUEUE.pop();

    if (window.HC_LOADING_QUEUE.length <= 0) {
      message.destroy();
    }
  }

  if (response.status >= 200 && response.status < 300) {
    try {
      data = await response.json();
    } catch (e) {
      data = {
        code: 1001,
        msg: '响应数据语法错误',
      };
    }
  } else {
    data = {
      code: 1000,
      msg: `抱歉，请求失败，请检查网络后重试 (CODE:${response.status})`,
    };
  }

  if (data.code == 999) {
    // 添加登录失效的处理代码
    history.replace('/login');

    // sleep等待
    await Utils.sleep(10000);
  }

  if (showError && data.code !== 0 && data.code !== 998 && data.code !== 999) {
    await message.error(data.data, 1.5);
  }

  return data;
}

/**
 * get请求封装函数
 * @param url
 * @param param
 * @returns {{}}
 */
export async function get(url = '', param = {}, showLoading = true, showError = true) {
  let data = {};
  let response;
  const queryStr = Utils.jsonToQueryString(param);

  if (showLoading) {
    if (window.HC_LOADING_QUEUE.length <= 0) {
      message.loading('加载中', 0);
    }

    window.HC_LOADING_QUEUE.push('');
  }

  try {
    response = await fetch(`${DOMAIN}${url}${url.indexOf('?') >= 0 ? '&' : '?'}${queryStr}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
  } catch (e) {
    console.log(e);
    if (window.STATUS_REDIRECT) {
      await Utils.sleep(3000);
    }

    response = {
      status: 500,
      statusText: '请求失败，请检查您的网络是否正常',
    };
  }

  if (showLoading) {
    window.HC_LOADING_QUEUE.pop();

    if (window.HC_LOADING_QUEUE.length <= 0) {
      message.destroy();
    }
  }

  if (response.status >= 200 && response.status < 300) {
    try {
      data = await response.json();
    } catch (e) {
      data = {
        code: 1001,
        msg: '响应数据语法错误',
      };
    }
  } else {
    data = {
      code: 1000,
      msg: `抱歉，请求失败，请检查网络后重试 (CODE:${response.status})`,
    };
  }
  if (data.code == 999) {
    // 添加登录失效的处理代码
    history.replace('/login');

    // sleep等待
    await Utils.sleep(10000);
  }

  if (showError && data.code !== 0 && data.code !== 998 && data.code !== 999) {
    await message.error(data.data, 1.5);
  }

  return data;
}

/**
 * getText
 * @param url
 * @param param
 * @returns {{}}
 */
export async function getText(url = '') {
  let data = {};
  let response;
  try {
    response = await fetch(`${DOMAIN}${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
  } catch (e) {
    response = '';
  }

  if (response.status >= 200 && response.status < 300) {
    try {
      data = await response.text();
    } catch (e) {
      data = '';
    }
  } else {
    data = '';
  }

  return data;
}

/**
 * dowload函数
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export async function download(url, param) {
  const body = Utils.jsonToQueryString(param);
  const response = await fetch(`${DOMAIN}${url}`, {
    ...body,
    credentials: 'include',
    method: 'POST',
    headers: {
      mode: 'no-cors',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
  let data = {
    code: -1,
  };

  if (response.status >= 200 && response.status < 300) {
    const contentType = response.headers.get('content-type');
    if (contentType.indexOf('application/json') > 0) {
      data = await response.json();
    } else {
      const contentDisposition = decodeURIComponent(response.headers.get('content-disposition'));
      const filename = contentDisposition.match(/filename=([^;]*)/)[1];
      const a = document.createElement('a'); // eslint-disable-line
      response.blob().then((blob) => {
        const $url = window.URL.createObjectURL(blob); // eslint-disable-line
        a.href = $url;
        a.download = filename || `${new Date().getTime()}`;
        a.click();
        window.URL.revokeObjectURL($url); // eslint-disable-line
      });
      data = {
        code: 0,
      };
    }
  } else {
    data = {
      code: -1,
      error: response.statusText,
    };
  }

  if (data.code === 999) {
    // to authority
    data = await authority('/api/authority');

    if (data.code === 0) {
      return request(url, options);
    }
  }

  return { data };
}
