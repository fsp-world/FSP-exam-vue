import request from '@/utils/requers';

export const sendGuaranteeRequest = (data: any) => request.post('/guarantee/request', JSON.stringify(data));
export const guaranteeQuery = () => request.get('/guarantee/query');
