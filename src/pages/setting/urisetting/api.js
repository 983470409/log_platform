import { get, post } from '@/utils/request';

// // 获取系统名称下拉框数据列表
// export const getSysList = (param = {}) => post('/api/autotest/automock/getsys', param);
//
// // 获取接口列表
// export const getApiList = (param = {}) => get('/api/autotest/automock/getsysapiinfo', param);

// 获取列表数据
export const getUriList = (param = {}) => post('/api/customerplatform/uri/page', param);

// 新增接口
export const addUri= (param = {}) => post('/api/customerplatform/uri/add', param);

// 更新接口
export const updateUri = (param = {}) => post('/api/customerplatform/uri/update', param);

// 删除接口
export const deleteUri = (param = {}) => post('/api/customerplatform/uri/delete', param);

// 获取详情
export const getUriDetail = (param = {}) => post('/api/customerplatform/uri/geturibyid', param);
