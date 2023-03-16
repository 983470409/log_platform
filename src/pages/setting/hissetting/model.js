import * as Api from './api';
import { message } from 'antd';

export default {
  namespace: 'hisSetting',
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
      const { code, data = {} } = yield call(Api.getHisList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {hisList: data},
      });
      return data;
    },

    * add({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addHis, payload);
      if (code !== 0) return false;
      return true;
    },

    * update({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.updateHis, payload);
      if (code !== 0) return false;
      return true;
    },

    * delete({ payload }, { call }) {
      const { code } = yield call(Api.deleteHis, payload);
      if (code !== 0) return false;
      return true;
    },

    * getDetail({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getHisDetail, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {dataDetail: data},
      });
      return data;
    },
  },
};
