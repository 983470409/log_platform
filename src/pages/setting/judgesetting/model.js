import * as Api from './api';
import { message } from 'antd';

export default {
  namespace: 'judgeSetting',
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
      const { code, data = {} } = yield call(Api.getJudgeList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {judgeList: data},
      });
      return data;
    },

    * add({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addJudge, payload);
      if (code !== 0) return false;
      return true;
    },

    * update({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.updateJudge, payload);
      if (code !== 0) return false;
      return true;
    },

    * delete({ payload }, { call }) {
      const { code } = yield call(Api.deleteJudge, payload);
      if (code !== 0) return false;
      return true;
    },

    * getDetail({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getJudgeDetail, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {dataDetail: data},
      });
      return data;
    },

    * getJudgeResultBindTree({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getJudgeResultBindTree, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload:
            {
              treeDataList: data.treeNodeList,
              treeDataChoiceList: data.choiceValues,
            },
      });
      return data;
    },

    * bindJudgeResult({ payload }, { call }) {
      const { code } = yield call(Api.bindJudgeResult, payload);
      if (code !== 0) return false;
      return true;
    },
  },
};
