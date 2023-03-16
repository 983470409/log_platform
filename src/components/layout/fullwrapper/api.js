import { get, post } from '@/utils/request';

export const getCurrentUser = async () => post('/api/mch/account/getUserInfo');

export const signout = async () => post('/api/mch/account/logout');
