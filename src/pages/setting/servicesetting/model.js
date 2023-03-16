import * as Api from './api';
import { message } from 'antd';

export default {
  namespace: 'serviceSetting',
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
    clearBindData(state) {
      return { ...state, treeDataChoiceList:[], treeDataList: [],} ;
    },
  },
  effects: {

    * getPageList({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getServiceList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {serviceList: data},
      });
      return data;
    },

    * getSubServicetTypeList({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getServiceList, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {subServicetTypeList: data},
      });
      return data;
    },

    * add({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.addService, payload);
      if (code !== 0) return false;
      return true;
    },

    * update({ payload }, { call }) {
      const { code, data = {} } = yield call(Api.updateService, payload);
      if (code !== 0) return false;
      return true;
    },

    * delete({ payload }, { call }) {
      const { code } = yield call(Api.deleteService, payload);
      if (code !== 0) return false;
      return true;
    },

    * getDetail({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getServiceDetail, payload);
      if (code !== 0) return false;
      yield put({
        type: 'save',
        payload: {dataDetail: data},
      });
      return data;
    },

    * getUriBindTree({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getUriBindTree, payload);
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

    * getJudgeBindTree({ payload }, { put, call }) {
      const { code, data = {} } = yield call(Api.getJudgeBindTree, payload);
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

    * bindUri({ payload }, { call }) {
      const { code } = yield call(Api.bindUri, payload);
      if (code !== 0) return false;
      return true;
    },

    * bindJudge({ payload }, { call }) {
      const { code } = yield call(Api.bindJudge, payload);
      if (code !== 0) return false;
      return true;
    },
  },
};
