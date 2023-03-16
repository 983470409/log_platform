import { get, post,postJson } from '@/utils/request';

// 获得seq明细
export const getSeqList = (param = {}) => post('/api/customerplatform/hisservice/queryBySeqsAndTime', param);

