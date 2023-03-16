import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';

import { FullWrapper } from '../../components/layout';

import routeConfig from './routeConfig';

/**
 * 动态加载容器组件，根据按需加载 model 和组件
 * @param app
 * @param models
 * @param component
 */
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models,
  component,
});

const WrapperRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={routeProps => (
      <Component {...routeProps} />
    )}
  />
);

function filterRoutes({
  routeTree = [],
  route = [],
  app,
  filter = () => false,
}) {
  route.forEach((childRoute) => {
    // 满足 filter
    if (filter(childRoute)) {
      // 如果同时存在 redirect、component，则只有 redirect 生效
      if (childRoute.redirect) {
        // 如果路由配置包含 redirect，则直接跳转路由
        routeTree.push(<Route key={childRoute.pathname} path={childRoute.pathname} exact render={() => <Redirect to={childRoute.redirect} />} />);
      } else if (childRoute.component) {
        routeTree.push(<WrapperRoute
          key={childRoute.pathname}
          path={childRoute.pathname}
          component={dynamicWrapper(app, childRoute.models || [], childRoute.component)}
          exact={!(childRoute.exact === false)}
        />);
      }
    }

    if (childRoute.routes && childRoute.routes.length > 0) {
      routeTree = filterRoutes({
        routeTree,
        route: childRoute.routes,
        filter,
        app,
      });
    }
  });

  return routeTree;
}

function RouterConfig({ app }) {
  return (
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <Switch>

          {/* 无布局路由 */}
          {
            filterRoutes({
              routeTree: [],
              route: routeConfig,
              app,
              filter: n => !n.layout,
            })
          }

          {/* 使用 FullWrapper 布局 */}
          <Route
            path="/"
            component={routeProps => (
              <FullWrapper
                {...routeProps}
                showMenuTree={routeConfig}
              >
                <Switch>
                  {
                    filterRoutes({
                      routeTree: [],
                      route: routeConfig,
                      app,
                      filter: n => n.layout === 'FullWrapper',
                    })
                  }

                  {/* 404 重定向 */}
                  <Route path="*" redirect="/" />
                </Switch>
              </FullWrapper>
            )}
          />
        </Switch>
      </HashRouter>
    </ConfigProvider>
  );
}

export default RouterConfig;
