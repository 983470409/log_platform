import React from 'react';
import {connect} from 'dva';
import {Route, Switch, Redirect, routerRedux, Link, Modal} from 'dva/router';
import {Layout} from 'antd';
import styles from './style.less';

import SiderMenu from './com/SiderMenu';
import TopMenu from './com/TopMenu';

const { Content } = Layout;

class LayoutFullWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.fetchUser();
    // this.fetchMenus();
  }

  // fetchUser = () => {
  //   const { dispatch } = this.props;

  //   dispatch({
  //     type: 'layoutFullWrapper/getCurrentUser',
  //   });
  // }

  fetchMenus = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'FullWrapper/fetchShowMenus',
    });
  }

  handleSignout = () => {
    const { dispatch } = this.props;

    new Promise((resolve, reject) => {
      dispatch({
        type: 'FullWrapper/signout',
        payload: { resolve, reject },
      });
    }).then((result) => {
      if (result) {
        dispatch(routerRedux.replace('/login'));
      }
    });
  }

  render() {
    const { location = {}, children, user = {}, showMenuTree = [] } = this.props;
    return (
      <Layout style={{ minWidth: 1280, minHeight: '100vh'}}>
        <SiderMenu location={location} menuTree={showMenuTree} />
        <Layout>
          <TopMenu user={user} onSignout={this.handleSignout} />
          <Layout style={{ padding: '13px 20px' }}>
            <Content className={styles.container}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

function mapState(state) {
  const { FullWrapper } = state;
  return {
    ...FullWrapper,
  };
}

export default connect(mapState)(LayoutFullWrapper);
