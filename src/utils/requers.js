import axios from 'axios';

export const getBearerToken = () => {
  const token = localStorage.getItem('fsp_token');
  return token ? 'Bearer ' + token : null;
};

const request = axios.create({
  adapter: 'fetch',
  baseURL: import.meta.env.VITE_API_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = getBearerToken();
  if (token) {
    config.headers['Authorization'] = token;
  }

  // 智能设置 Content-Type
  // 如果用户没有在具体请求中手动指定 Content-Type，且发送的数据是普通对象，则默认为 JSON
  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export default request;
