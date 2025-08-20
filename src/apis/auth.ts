import request from '@/utils/requers';

export const login = (data: any) => request.post('/auth/login', JSON.stringify(data));

export const register = (data: any) => request.post('/auth/register', JSON.stringify(data));

export const logout = () => request.post('/auth/logout');

export const checkLogin = () => request.get('/auth/check');

export const findPassword = (data: any) => request.post('/auth/findPassword', JSON.stringify(data));

export const findPasswordPut = (data: any, token: string) =>
  request.put('/auth/findPassword?token=' + token, JSON.stringify(data));

export const sendActivation = () => request.post('/auth/reqActivation');

export const activation = (data: any, token: string) =>
  request.put('/auth/activation?token=' + token, JSON.stringify(data));
