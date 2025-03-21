import request from '@/utils/requers';

export const getSurvey = (id) => request.get('/survey/survey/' + id);

export const checkSurvey = () => request.post('/survey/check_survey');

export const startSurvey = (data = {}) => request.post('/survey/start_survey', JSON.stringify(data));

export const completeSurvey = (data) => request.post('/survey/complete_survey', data)

