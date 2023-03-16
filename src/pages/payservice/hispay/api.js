import { get, post,postJson } from '@/utils/request';

// 获取项目下拉框数据列表
export const getLogData = (param = {}) => post('/api/customerplatform/hisservice/query', param);

// 获取列表数据
export const getHisList = (param = {}) => post('/api/customerplatform/hisMapper/page', param);

export const getServiceType = (param = {}) => post('/api/customerplatform/serviceType/getserviceType', param);
