import * as Api from './api';

export default {
  namespace: 'order',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return {};
    },
  },
  effects: {
    * query({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getLogData, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {queryResult: data},
      });
      return data;
    },

    * getHisList({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getHisList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {hisList: data.recordList},
      });
      return data;
    },

    * getServiceType({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getServiceType, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {serviceType: data},
      });
      return data;
    },
    * getSubServiceType({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getSubServiceType, payload);
      if (code !== 0) {
        return false;
      }
      yield put({
        type: 'save',
        payload: {SubTypeList: data},
      });
      return data;
    },
  },
};
