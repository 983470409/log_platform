/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable array-callback-return */
import React from 'react';
import {connect} from 'dva';
import {routerRedux, withRouter} from 'dva/router';
import {Layout, Menu, Icon} from 'antd';

import styles from '../style.less';

const { SubMenu } = Menu;
const { Sider } = Layout;

class SiderMenu extends React.Component {
  constructor(props) {
    super(props);
    const routerArr = this.getRouteArr(this.props.menuTree, this.props.location.pathname);
    const openKeys = routerArr.map((item) => {
      return item.pathname;
    }).reverse();
    this.state = {
      openKeys,
    };
  }

  componentDidMount() {
    console.log(this.renderMenu(this.props.menuTree), '----');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.menuTree !== nextProps.menuTree) {
      this.setState({
        openKeys: (nextProps.menuTree || []).map(item => item.pathname),
      });
    }
  }

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys,
    });
  };
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

  renderMenu = (menuTree = []) => {
    const menu = [];
    menuTree.map((item) => {
      if (item.routes && item.routes.length > 0) {
        menu.push(<SubMenu
          selectable
          key={item.pathname}
          title={
            <span>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </span>
          }
        >
          {
            this.renderMenu(item.routes)
          }
        </SubMenu>);
      } else {
        menu.push(<Menu.Item key={item.pathname}>
          {
            item.icon && <Icon type={item.icon} />
          }
          {item.title}
        </Menu.Item>);
      }
    });
    return menu;
  }

  render() {
    const { dispatch, location } = this.props;
    const { openKeys } = this.state;
    const fullPath = `${location.pathname}${location.search ? `${location.search}` : ''}`;
    return (
      <Sider
        className={styles.sider}
      >
        <div className={styles.siderLogo}>
          <img className={styles.logoIcon} alt="海鹚科技" src={require('../../../../resources/image/logo.png')} />
        </div>
        <Menu
          selectedKeys={[fullPath]}
          onOpenChange={this.onOpenChange}
          mode="inline"
          openKeys={openKeys}
          style={{
            backgroundColor: '#0F163A',
          }}
          theme="dark"
          onClick={
            (menu) => {
              if (menu.keyPath === fullPath) {
                return;
              }
              this.setState({
                openKeys: menu.keyPath,
              });
              dispatch(routerRedux.push({
                pathname: menu.key,
              }));
              dispatch({
                type: 'FullWrapper/saveTitle',
                payload: {title: menu.item.props.children},
              });
            }
          }
        >
          {
            this.renderMenu(this.props.menuTree)
          }
        </Menu>
      </Sider>
    );
  }
}

function mapState(state) {
  const {root} = state;
  return {
    ...root,
  };
}

export default withRouter(connect(mapState)(SiderMenu));
