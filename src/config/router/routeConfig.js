const routeConfig = [
    {
    title: '医院业务模块',
    pathname: '/hisservice',
    icon: 'stock',
    layout: 'FullWrapper',
    routes: [
      {
        title: '绑卡问题',
        pathname: '/',
        layout: 'FullWrapper',
        component: () => import('@/pages/hisservice/bingcard'),
        models: () => [import('@/pages/hisservice/bingcard/model')],
      },
      {
        title: '号源问题',
        pathname: '/hisservice/numsource',
        layout: 'FullWrapper',
        component: () => import('@/pages/hisservice/numsource'),
        models: () => [import('@/pages/hisservice/numsource/model')],
      },
      {
        title: '停诊问题',
        pathname: '/hisservice/withdrawalmeeting',
        layout: 'FullWrapper',
        component: () => import('@/pages/hisservice/withdrawalmeeting'),
        models: () => [import('@/pages/hisservice/withdrawalmeeting/model')],
      },
      {
        title: '住院问题',
        pathname: '/hisservice/inhospital',
        layout: 'FullWrapper',
        component: () => import('@/pages/hisservice/inhospital'),
        models: () => [import('@/pages/hisservice/inhospital/model')],
      },
      {
        title: '报告问题',
        pathname: '/hisservice/report',
        layout: 'FullWrapper',
        component: () => import('@/pages/hisservice/report'),
        models: () => [import('@/pages/hisservice/report/model')],
      },
      {
        title: '消息推送',
        pathname: '/hisservice/newspush',
        layout: 'FullWrapper',
        component: () => import('@/pages/hisservice/newspush'),
        models: () => [import('@/pages/hisservice/newspush/model')],
      },
    ],
  },
  {
    title: '支付模块',
    pathname: '/payservice',
    icon: 'stock',
    layout: 'FullWrapper',
    routes: [
      {
        title: '门诊缴费',
        pathname: '/payservice/outpatientpayment',
        layout: 'FullWrapper',
        component: () => import('@/pages/payservice/outpatientpayment'),
        models: () => [import('@/pages/payservice/outpatientpayment/model')],
      },
      {
        title: '订单问题',
        pathname: '/payservice/order',
        layout: 'FullWrapper',
        component: () => import('@/pages/payservice/order'),
        models: () => [import('@/pages/payservice/order/model')],
      },
      {
        title: '当面付/扫码付',
        pathname: '/payservice/hispay',
        layout: 'FullWrapper',
        component: () => import('@/pages/payservice/hispay'),
        models: () => [import('@/pages/payservice/hispay/model')],
      },
    ],
  },
  {
    title: '日志查询',
    pathname: '/servicedesk',
    icon: 'stock',
    layout: 'FullWrapper',
    routes: [
      {
        title: 'Seqs查询',
        pathname: '/servicedesk/queryseqs',
        layout: 'FullWrapper',
        component: () => import('@/pages/servicedesk/queryseqs'),
        models: () => [import('@/pages/servicedesk/queryseqs/model')],
      },
    ],
  },
  {
    title: '设置',
    pathname: '/setting',
    icon: 'stock',
    layout: 'FullWrapper',
    routes: [
      {
        title: '业务类型设置',
        pathname: '/setting/servicesetting',
        layout: 'FullWrapper',
        component: () => import('@/pages/setting/servicesetting'),
        models: () => [import('@/pages/setting/servicesetting/model')],
      },
      {
        title: 'Uri设置',
        pathname: '/setting/urisetting',
        layout: 'FullWrapper',
        component: () => import('@/pages/setting/urisetting'),
        models: () => [import('@/pages/setting/urisetting/model')],
      },
      {
        title: '策略设置',
        pathname: '/setting/judgesetting',
        layout: 'FullWrapper',
        component: () => import('@/pages/setting/judgesetting'),
        models: () => [import('@/pages/setting/judgesetting/model')],
      },
      {
        title: '关键字设置',
        pathname: '/setting/judgekeysetting',
        layout: 'FullWrapper',
        component: () => import('@/pages/setting/judgekeysetting'),
        models: () => [import('@/pages/setting/judgekeysetting/model')],
      },
      {
        title: '评论列表',
        pathname: '/setting/review',
        layout: 'FullWrapper',
        component: () => import('@/pages/setting/review'),
        models: () => [import('@/pages/setting/review/model')],
      },
      {
        title: '医院映射管理',
        pathname: '/setting/hissetting',
        layout: 'FullWrapper',
        component: () => import('@/pages/setting/hissetting'),
        models: () => [import('@/pages/setting/hissetting/model')],
      },
    ],
  },
];

const findRoute = ({ pathname }) => {
  let isGet = false;
  let node = null;

  function deepSearch(routes, _pathname) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].routes && routes[i].routes.length > 0) {
        deepSearch(routes[i].routes, pathname);
      }
      if (_pathname === routes[i].pathname || isGet) {
        isGet || (node = routes[i]);
        isGet = true;
        break;
      }
    }
  }

  deepSearch(routeConfig, pathname);

  return node;
};

export default routeConfig;
export { findRoute };
