/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router';
import { Layout, Avatar, Icon, Breadcrumb, Form } from 'antd';
import _ from 'lodash';
import styles from '../style.less';
import routeConfig from '../../../../config/router/routeConfig';

const { Header } = Layout;

class TopMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static getDerivedStateFromProps(props) {
    const { location, menuTree = [] } = props;
    const fullPath = `${location.pathname}${location.search ? `${location.search}` : ''}`;
    let isMenuLocation = true;

    const subMenus = _.reduce(_.map(menuTree || [], 'routes'), (prev, next) => {
      return _.concat(prev, next);
    });


    for (let i = 0; i < (subMenus || []).length; i++) {
      const menu = subMenus[i];

      if (fullPath === menu.pathname) {
        isMenuLocation = false;
        break;
      }
    }

    return {
      backNavVisible: isMenuLocation,
    };
  }

  componentDidMount() {
  }

  goBack = () => {
    this.props.dispatch(routerRedux.goBack());
  }

  getRouteArr = (menu = [], pathname = '/') => {
    const resArr = [];
    let hasFind = false;
    function iteratorFn(arr, targetPathname) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].pathname === targetPathname) {
          resArr.push(arr[i]);
          hasFind = true;
          break;
        } else if (arr[i].routes && arr[i].routes.length > 0 && !hasFind) {
          resArr.push(arr[i]);
          iteratorFn(arr[i].routes, targetPathname);
        } else if (i === (arr.length - 1) && !hasFind) {
          resArr.splice(resArr.length - 1, 1);
        }
      }
    }
    iteratorFn(menu, pathname);
    return resArr;
  }

  render() {
    const { user = {}, onSignout = () => {}, title, location = {} } = this.props;
    const routeArr = this.getRouteArr(routeConfig, location.pathname);
    return (
      <Header className={styles.header}>
        <div className={styles.headerWrap}>
          <div className={styles.title}>
            <Icon type="menu-unfold" />
            <span>{title}</span>
          </div>
          <div className={styles.userWrap}>
            <Avatar size={34} style={{ background: '#ccc', color: '#000' }}>
              {user.account || ''}
            </Avatar>
            <div className={styles.userName}>
              {user.account || 'admin'}
            </div>
            <div className={styles.logout} onClick={onSignout}>注销登陆</div>
          </div>
        </div>
        <Breadcrumb separator=">" style={{marginLeft: 20}}>
          {
            routeArr.map((i) => {
              return (<Breadcrumb.Item key={i.pathname}>
                <a href={`/#${i.pathname}`}>{i.title}</a>
              </Breadcrumb.Item>);
            })
          }
        </Breadcrumb>
      </Header>
    );
  }
}

function mapState(state) {
  const { FullWrapper } = state;
  return {
    ...FullWrapper,
  };
}

export default withRouter(connect(mapState)(Form.create()(TopMenu)));
