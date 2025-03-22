import request from '@/utils/requers';

export const getWhitelist = () => request.get('/admin/whitelist');
export const getQuestion = () => request.get('/admin/AllQuestion');
export const getResponses = () => request.get('/admin/responses');
export const getUsers = () => request.get('/admin/users');
export const getSurveys = () => request.get('/admin/surveys');
export const getSurvey = (id) => request.get('/admin/survey/' + id);
export const addSurvey = (data) => request.post('/admin/addSurvey', JSON.stringify(data));
export const addQuestion = (data) => request.post('/admin/addQuestion', JSON.stringify(data));
export const reviewedResponse = (data) => request.post('/admin/reviewed', JSON.stringify(data));
