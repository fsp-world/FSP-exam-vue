import request from '@/utils/requers';

export const getUserInfo = () => request.get('/user/getInfo');
export const getUserWhitelist = () => request.get('/user/getWhitelist');
export const setUserAvatar = (uuid) =>
  request.post('/user/setAvatar', {
    uuid: uuid,
  });
