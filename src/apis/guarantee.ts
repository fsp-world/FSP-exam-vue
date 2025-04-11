import request from '@/utils/requers';

export const sendGuaranteeRequest = (data: any) => request.post('/guarantee/request', JSON.stringify(data));
export const guaranteeQueryALLAPI = () => request.get('/guarantee/query_all');
export const guaranteeActionAPI = (data: any) => request.post('/guarantee/action', JSON.stringify(data));
