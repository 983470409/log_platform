import queryString from 'query-string';

/**
 * 等待
 * @param time
 * @returns {Promise}
 */
export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 * 分转元
 * @param moneyString
 * @param mark
 * @returns {*}
 */
export const formatMoney = (moneyString = '0', mark = 100) => {
  try {
    const moneyNumber = parseFloat(moneyString);
    if (typeof moneyNumber === 'number' && typeof mark === 'number') {
      return parseFloat(moneyNumber / mark).toFixed(2);
    }
    return 0;
  } catch (e) {
    console.log('error', e); // 缺失全局异常处理
    return 0;
  }
};

/**
 * 对象转键值对
 * @param json
 * @returns {*|number}
 */
export function jsonToQueryString(json = {}) {
  return queryString.stringify(json);
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns {*|boolean}
 */
export function checkNullObj(obj) {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

/**
 * 判断数组是否为空
 * @param arr
 * @returns {*|boolean}
 */
export function checkNullArray(arr) {
  if (!arr) return true;
  if (!(arr instanceof Array)) return true;
  return arr.length === 0;
}

// Map，匹配每个HostTag在树中对应的index
const dataMap = new Map([
  ['bill', 0],
  ['newcore', 1],
  ['docker', 2],
  ['ehhlw', 3],
  ['hcQzj', 4],
  ['hibaby', 5],
  ['hiwork', 6],
  ['hizpay', 7],
  ['qzj', 8],
  ['xcx', 9],
]);

export function handleHostList(data = []) {
  if (data.length === 0) return [];
  // 基础树结构
  const hostList = [
    {
      id: 'root',
      text: '海鹚科技',
      children: [
        {
          id: 'bill',
          text: '对账平台',
          children: [],
        },
        {
          id: 'newcore',
          text: '核心平台',
          children: [],
        },
        {
          id: 'docker',
          text: 'K8平台',
          children: [],
        },
        {
          id: 'ehhlw',
          text: '互联网医院',
          children: [],
        },
        {
          id: 'hcQzj',
          text: '公共前置机',
          children: [],
        },
        {
          id: 'hibaby',
          text: 'Hibaby',
          children: [],
        },
        {
          id: 'hiwork',
          text: '企业号',
          children: [],
        },
        {
          id: 'hizpay',
          text: '云速支付',
          children: [],
        },
        {
          id: 'qzj',
          text: '海鹚前置机',
          children: [],
        },
        {
          id: 'xcx',
          text: '小程序',
          children: [],
        },
        {
          id: 'it',
          text: 'IT运维',
          children: [],
        },
      ],
    },
  ];
  // 遍历整个数组，把对应的HostTag放到对应的children里
  data.forEach((item) => {
    item.isLeaf = true;
    item.text = item.hostname;
    const index = dataMap.get(item.Host_Tag);
    if (!index) {
      hostList[0].children[10].children.push(item);
    } else {
      hostList[0].children[index].children.push(item);
    }
  });
  return hostList;
}

/* 从cookie中获取csrfmiddlewaretoken */

export function getCsrfMiddlewareToken() {
  const cookieArr = document.cookie.split('; ');
  for (let i = 0; i < cookieArr.length; i++) {
    const cookieItem = cookieArr[i].split('=');
    if (cookieItem[0] == 'csrftoken') return cookieItem[1];
  }
}

// 设置 sessionStorage
export function setSessionStorage(key, value) {
  window.sessionStorage.setItem(key, value);
}

// 通过 key 获取 sessionStorage
export function getSessionStorage(key) {
  return window.sessionStorage.getItem(key);
}

export function numToChineseNum(num) {
  const chineseNumArr = [
    '无',
    '单',
    '双',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
  ];
  return num && Number(num) ? chineseNumArr[num] : '无';
}

/**
 * 过滤html标签
 * @param logContent
 * @returns {*}
 */
export function filterHtmlElement(logContent) {
  return logContent.replace(/[<>&"']/g, function(c){
    return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c];
  });


}
