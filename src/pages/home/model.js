import * as Api from './api';

export default {
  namespace: 'home',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clear() {
      return {};
    },
    clearForm(state) {
      return { ...state, projectDetail: { }};
    },
  },
  effects: {
    * getProject({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getProject, payload);

      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {projectList: data},
      });
      return data;
    },

    * addProject({ payload }, { put, call }) {
      const { data, code } = yield call(Api.addProject, payload);
      if (code !== 0) return false;
      return true;
    },

    * getProjectDetail({ payload }, { put, call }) {
      const { data = {}, code } = yield call(Api.getProjectDetail, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {projectDetail: data},
      });
      return true;
    },

    * updateProject({ payload }, { put, call }) {
      const { data, code } = yield call(Api.updateProject, payload);
      if (code !== 0) return false;
      return true;
    },
  },
};
