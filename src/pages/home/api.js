import { get, post } from '@/utils/request';

// 获取所有项目
export const getProject = (param = {}) => post('/api/autotest/project/allPros', param);

// 新增项目
export const addProject = (param = {}) => post('/api/autotest/project/add', param);

// 查询项目详情
export const getProjectDetail = (param = {}) => get('/api/autotest/project/findById', param);

// 更新项目信息
export const updateProject = (param = {}) => post('/api/autotest/project/update', param);
