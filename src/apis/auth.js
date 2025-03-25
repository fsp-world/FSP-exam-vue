import request from '@/utils/requers';

export const login = (data) => request.post('/auth/login', JSON.stringify(data));

export const register = (data) => request.post('/auth/register', JSON.stringify(data));

export const logout = () => request.post('/auth/logout');

export const checkLogin = () => request.get('/auth/check');

export const findPassword = (data) => request.post('/auth/findPassword', JSON.stringify(data))
