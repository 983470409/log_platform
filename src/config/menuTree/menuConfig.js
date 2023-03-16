const menuConfig = [
  // {
  //   title: '首页',
  //   pathname: '/',
  //   layout: null,
  //   icon: 'home',
  // },
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
      },
      {
        title: '号源问题',
        pathname: '/hisservice/numsource',
        layout: 'FullWrapper',
      },
      {
        title: '停诊问题',
        pathname: '/hisservice/withdrawalmeeting',
        layout: 'FullWrapper',
      },
      {
        title: '住院问题',
        pathname: '/hisservice/inhospital',
        layout: 'FullWrapper',
      },
      {
        title: '报告问题',
        pathname: '/hisservice/report',
        layout: 'FullWrapper',
      },
      {
        title: '消息推送',
        pathname: '/hisservice/newspush',
        layout: 'FullWrapper',
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
      },
      {
        title: '订单问题',
        pathname: '/payservice/order',
        layout: 'FullWrapper',
      },
      {
        title: '当面付/扫码付',
        pathname: '/payservice/hispay',
        layout: 'FullWrapper',
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
      },
      {
        title: 'Uri设置',
        pathname: '/setting/urisetting',
        layout: 'FullWrapper',
      },
      {
        title: '策略设置',
        pathname: '/setting/judgesetting',
        layout: 'FullWrapper',
      },
      {
        title: '关键字设置',
        pathname: '/setting/judgekeysetting',
        layout: 'FullWrapper',
      },
      {
        title: '评论列表',
        pathname: '/setting/review',
        layout: 'FullWrapper',
      },
      {
        title: '医院映射管理',
        pathname: '/setting/hissetting',
        layout: 'FullWrapper',
      },
    ],
  },
];

export default menuConfig;
