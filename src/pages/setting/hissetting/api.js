import { get, post } from '@/utils/request';

// // 获取系统名称下拉框数据列表
// export const getSysList = (param = {}) => post('/api/autotest/automock/getsys', param);
//
// // 获取接口列表
// export const getApiList = (param = {}) => get('/api/autotest/automock/getsysapiinfo', param);

// 获取列表数据
export const getHisList = (param = {}) => post('/api/customerplatform/hisMapper/page', param);

// 新增接口
export const addHis= (param = {}) => post('/api/customerplatform/hisMapper/add', param);

// 更新接口
export const updateHis = (param = {}) => post('/api/customerplatform/hisMapper/update', param);

// 删除接口
export const deleteHis = (param = {}) => post('/api/customerplatform/hisMapper/delete', param);

// 获取详情
export const getHisDetail = (param = {}) => post('/api/customerplatform/hisMapper/gethisMapperbyid', param);
