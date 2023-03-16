import * as Api from './api';

export default {
  namespace: 'queryseqs',
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
      const { code, data = {} } = yield call(Api.getLogDataBySeqs, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {queryResult: data},
      });
      return data;
    },
  },
};
