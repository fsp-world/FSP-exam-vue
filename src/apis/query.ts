import request from '@/utils/requers';

export const getResponses = () => request.get('/query/response');
