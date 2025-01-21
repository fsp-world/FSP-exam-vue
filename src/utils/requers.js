import axios from 'axios'

export const getBearerToken = () => {
    return 'Bearer ' + localStorage.getItem('fsp_token');
}


const baseURL = 'http://localhost:5000'

const request = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(config => {

    config.headers['Authorization'] = getBearerToken();

    return config;
})

export default request