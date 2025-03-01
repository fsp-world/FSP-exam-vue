import request from '@/utils/requers';

export const getUserInfo = () => request.get('/user/getInfo');
export const getUserWhitelist = () => request.get('/user/getWhitelist');
