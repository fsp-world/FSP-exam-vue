import request from '@/utils/requers';

export const getSurvey = (id) => request.get('/default/survey/' + id);
