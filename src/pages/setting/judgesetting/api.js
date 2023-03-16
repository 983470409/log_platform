import { get, post } from '@/utils/request';


// 获取列表数据
export const getJudgeList = (param = {}) => post('/api/customerplatform/judge/page', param);

// 新增接口
export const addJudge = (param = {}) => post('/api/customerplatform/judge/add', param);

// 更新接口
export const updateJudge = (param = {}) => post('/api/customerplatform/judge/update', param);

// 删除接口
export const deleteJudge = (param = {}) => post('/api/customerplatform/judge/delete', param);

// 获取详情
export const getJudgeDetail = (param = {}) => post('/api/customerplatform/judge/getjudgebyid', param);

// 获取详情
export const getJudgeResultBindTree = (param = {}) => post('/api/customerplatform/judge/getbindjudgeresultdata', param);

// 绑定uri
export const bindJudgeResult = (param = {}) => post('/api/customerplatform/judge/bindresult', param);
