import { get, post } from '@/utils/request';

// // 获取系统名称下拉框数据列表
// export const getSysList = (param = {}) => post('/api/autotest/automock/getsys', param);
//
// // 获取接口列表
// export const getApiList = (param = {}) => get('/api/autotest/automock/getsysapiinfo', param);

// 获取列表数据
export const getJudgeResultList = (param = {}) => post('/api/customerplatform/judgeResult/page', param);

// 新增接口
export const addJudgeResult = (param = {}) => post('/api/customerplatform/judgeResult/add', param);

// 更新接口
export const updateJudgeResult = (param = {}) => post('/api/customerplatform/judgeResult/update', param);

// 删除接口
export const deleteJudgeResult = (param = {}) => post('/api/customerplatform/judgeResult/delete', param);

// 获取详情
export const getJudgeResultDetail = (param = {}) => post('/api/customerplatform/judgeResult/getjudgeResultbyid', param);
