import axios from 'axios';
import router from '@/router';

export const getBearerToken = () => {
  const token = localStorage.getItem('fsp_token');
  return token ? 'Bearer ' + token : null;
};

const request = axios.create({
  adapter: 'fetch',
  baseURL: import.meta.env.VITE_API_URL,
});

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = getBearerToken();
  if (token) {
    config.headers['Authorization'] = token;
  }

  if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// 响应拦截器 —— HTTP 错误码跳转错误页面
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 服务器返回了错误响应（有 HTTP 状态码）
      const status = error.response.status;
      const messages = {
        400: '请求参数有误',
        401: '未授权，请重新登录',
        403: '没有访问权限',
        404: '请求的资源不存在',
        405: '请求方法不允许',
        408: '请求超时',
        429: '请求太频繁，请稍后再试',
        500: '服务器内部错误',
        502: '网关错误',
        503: '服务暂不可用',
        504: '网关超时',
      };
      const message = messages[status] || `HTTP ${status}`;
      router.replace({
        path: '/error',
        query: { message, code: String(status) },
      });
    } else if (error.request) {
      // 请求已发出但没有收到响应（如 CORS 错误、网络断开）
      console.error('网络错误：无法连接到服务器', error.message);
      router.replace({
        path: '/error',
        query: { message: '网络错误：无法连接到服务器，请检查后端是否启动或 CORS 配置', code: 'NETWORK' },
      });
    } else {
      console.error('请求配置错误：', error.message);
    }
    return Promise.reject(error);
  },
);

export default request;
