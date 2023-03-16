import * as Api from './api';
import { message } from 'antd';

export default {
  namespace: 'uriSetting',
  state: {},
  reducers: {
    save(state, { payload }) {
      //平铺数据，全量替换state中的数据，payload数据会塞入props
      return { ...state, ...payload };
    },
    clear() {
      return {};
    },
    clearDetail(state) {
      return { ...state, dataDetail: {} };
    },
  },
  effects: {

    * getPageList({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getUriList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {uriList: data},
      });
      return data;
    },

    * add({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addUri, payload);
      if (code !== 0) return false;
      return true;
    },

    * update({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.updateUri, payload);
      if (code !== 0) return false;
      return true;
    },

    * delete({ payload }, { call }) {
      const { code } = yield call(Api.deleteUri, payload);
      if (code !== 0) return false;
      return true;
    },

    * getDetail({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getUriDetail, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {dataDetail: data},
      });
      return data;
    },
  },
};
