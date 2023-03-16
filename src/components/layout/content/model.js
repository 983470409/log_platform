import * as Api from './api';

export default {
  namespace: 'logsearch',
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

    * getSeqList({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getSeqList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {seqData: data},
      });
      return data;
    },

  },
};
