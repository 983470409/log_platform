// import { message } from 'antd';
import * as api from './api';
import menuConfig from '../../../config/menuTree/menuConfig';

export default {
  namespace: 'FullWrapper',
  state: {
    user: {},
    showMenuTree: menuConfig,
    title: '版本管理',
  },
  reducers: {
    // updateShowMenuTree(state, { payload }) {
    //   return {
    //     ...state,
    //     showMenuTree: payload,
    //   };
    // },

    updateUser(state, { payload }) {
      return {
        ...state,
        user: payload,
      };
    },
    saveTitle(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return {};
    },
  },
  effects: {

    * signout({ payload }, { call }) {
      const { resolve } = payload;
      const { code } = yield call(api.signout);

      if (code === 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    },
  },
};
