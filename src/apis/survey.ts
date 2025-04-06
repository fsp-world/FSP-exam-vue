import request from '@/utils/requers';

export const getSlotsAPI = () => request.get('/survey/get_slots');

export const getSurvey = (id: any) => request.get('/survey/survey/' + id);

export const checkSurvey = () => request.post('/survey/check_survey');

export const startSurvey = (data = {}) => request.post('/survey/start_survey', JSON.stringify(data));

export const completeSurvey = (data: any) => request.post('/survey/complete_survey', data);
