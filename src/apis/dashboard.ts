import request from '@/utils/requers';

const API_BASE_URL = '/dashboard'

export const usersInfo = () =>
  request.get(API_BASE_URL + '/usersInfo');

export const sysInfo = () =>
  request.get(API_BASE_URL + '/sysInfo');