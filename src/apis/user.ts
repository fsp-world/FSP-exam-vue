import request from '@/utils/requers';

export const getUserInfo = () => request.get('/user/getInfo');
export const getUserWhitelist = () => request.get('/user/getWhitelist');
export const setUserAvatar = (uuid: string) =>
  request.post('/user/setAvatar', {
    uuid: uuid,
  });
export const getPlayerChainOfTrust = (uuid: string) =>
  request.get('/user/getChainOfTrust', { params: { uuid: uuid } });
export const setUserBackground = (bgUrl: string) =>
  request.post('/user/profile/setBackground', { bg_url: bgUrl });
export const setUsername = (newUsername: string) =>
  request.post('/user/profile/setUsername', { newUsername });
