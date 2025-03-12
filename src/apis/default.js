import request from '@/utils/requers';

export const getSurvey = (id) => request.get('/default/survey/' + id);

export const checkSurvey = () => request.post('/default/check_survey');

export const startSurvey = (data = {}) => request.post('/default/start_survey', data);

