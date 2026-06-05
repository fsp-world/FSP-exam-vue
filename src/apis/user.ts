import request from '@/utils/requers';

export const getUserInfo = () => request.get('/user/getInfo');
export const getUserWhitelist = () => request.get('/user/getWhitelist');
export const setUserAvatar = (uuid: string) =>
  request.post('/user/setAvatar', {
    uuid: uuid,
  });
export const getPlayerChainOfTrust  = (uuid: string) => request.get('/user/getChainOfTrust', { params: {uuid: uuid} });
