import { post, request } from '@/utils/request';

export const getList = (param = {}) => post('/api/mch/demo', param);

export const logout = (param = {}) => request('GET', '/loginout', param);


// 获得seq明细
export const getSeqList = (param = {}) => post('/api/customerplatform/hisservice/queryBySeqsAndTime', param);

