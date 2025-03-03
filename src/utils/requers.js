import axios from 'axios';

export const getBearerToken = () => {
  const token = localStorage.getItem('fsp_token');
  return token ? 'Bearer ' + token : null;
};

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = getBearerToken();
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

export default request;
