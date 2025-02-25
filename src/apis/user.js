import request from '@/utils/requers';

export const getUserInfo = () => request.get('/user/getInfo');
