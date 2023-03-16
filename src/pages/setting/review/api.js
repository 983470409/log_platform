import { get, post } from '@/utils/request';

// // 获取系统名称下拉框数据列表
// export const getSysList = (param = {}) => post('/api/autotest/automock/getsys', param);
//
// // 获取接口列表
// export const getApiList = (param = {}) => get('/api/autotest/automock/getsysapiinfo', param);

// 获取mock列表
export const getReviewList = (param = {}) => post('/api/customerplatform/review/page', param);

// 新增mock接口
export const addReview = (param = {}) => post('/api/customerplatform/review/add', param);

// 更新mock接口
export const updateView = (param = {}) => post('/api/customerplatform/review/update', param);

// 删除mock接口
export const deleteView = (param = {}) => post('/api/customerplatform/review/delete', param);

// 获取mock详情
export const getReViewDetail = (param = {}) => post('/api/customerplatform/review/getreviewbyid', param);
