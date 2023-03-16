import { get, post } from '@/utils/request';

// // 获取系统名称下拉框数据列表
// export const getSysList = (param = {}) => post('/api/autotest/automock/getsys', param);
//
// // 获取接口列表
// export const getApiList = (param = {}) => get('/api/autotest/automock/getsysapiinfo', param);

// 获取列表数据
export const getServiceList = (param = {}) => post('/api/customerplatform/serviceType/page', param);

// 新增接口
export const addService= (param = {}) => post('/api/customerplatform/serviceType/add', param);

// 更新接口
export const updateService = (param = {}) => post('/api/customerplatform/serviceType/update', param);

// 删除接口
export const deleteService = (param = {}) => post('/api/customerplatform/serviceType/delete', param);

// 获取详情
export const getServiceDetail = (param = {}) => post('/api/customerplatform/serviceType/getserviceTypebyid', param);

// 获取详情
export const getUriBindTree = (param = {}) => post('/api/customerplatform/serviceType/getbinduridata', param);

// 获取详情
export const getJudgeBindTree = (param = {}) => post('/api/customerplatform/serviceType/getbindjudgedata', param);

// 绑定uri
export const bindUri = (param = {}) => post('/api/customerplatform/serviceType/binduri', param);

// 绑定策略
export const bindJudge = (param = {}) => post('/api/customerplatform/serviceType/bindjudge', param);
