import { get, post,postJson } from '@/utils/request';

// 获取项目下拉框数据列表
export const getLogDataBySeqs = (param = {}) => post('/api/customerplatform/hisservice/queryBySeqs', param);

