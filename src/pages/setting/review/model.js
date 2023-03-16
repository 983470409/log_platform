import * as Api from './api';
import { message } from 'antd';

export default {
  namespace: 'review',
  state: {},
  reducers: {
    save(state, { payload }) {
      //平铺数据，全量替换state中的数据
      return { ...state, ...payload };
    },
    clear() {
      return {};
    },
    clearDetail(state) {
      return { ...state, mockDetail: {} };
    },
  },
  effects: {

    * getPageList({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getReviewList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {reviewList: data},
      });
      return data;
    },

    * add({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addReview, payload);
      if (code !== 0) return false;
      return true;
    },

    * update({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.updateView, payload);
      if (code !== 0) return false;
      return true;
    },

    * delete({ payload }, { call }) {
      const { code } = yield call(Api.deleteView, payload);
      if (code !== 0) return false;
      return true;
    },

    * getDetail({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getReViewDetail, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {reviewDetail: data},
      });
      return data;
    },
  },
};
