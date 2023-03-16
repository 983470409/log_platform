import { setSessionStorage, getSessionStorage } from './utils/utils';
import { PROJECT_ID, PROJECT_NAME } from './config/constant/constant';
import * as api from './api';

export default {
  namespace: 'root',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return {};
    },
    saveProjectId(state, { payload }) {
      setSessionStorage(PROJECT_ID, payload.id);
      setSessionStorage(PROJECT_NAME, payload.projectName);
      return { ...state, ...payload };
    },
  },
  effects: {
    *logout({ payload }, { call }) {
      const { code } = yield call(api.logout, payload);
      if (code === 1001) {
        return true;
      } else {
        return false;
      }
    },

    * getSeqList({ payload }, { put, call }) {
      const { code, data = {} } = yield call(api.getSeqList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {seqData: data},
      });
      return data;
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const id = getSessionStorage(PROJECT_ID);
        const projectName = getSessionStorage(PROJECT_NAME);
        if (pathname.indexOf('/') != -1 && id) {
          dispatch({
            type: 'saveProjectId',
            payload: { id: Number(id), projectName },
          });
        }
      });
    },
  },
};
