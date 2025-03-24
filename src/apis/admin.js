import request from '@/utils/requers';

export const getWhitelist = () => request.get('/admin/whitelist');
export const getQuestion = () => request.get('/admin/AllQuestion');
export const getResponses = () => request.get('/admin/responses');
export const getUsers = () => request.get('/admin/users');
export const getUser = (id) => request.get('/admin/user', { params: { id } });
export const addUser = (data) => request.post('/admin/user', JSON.stringify(data));
export const updateUser = (data) => request.put('/admin/user', JSON.stringify(data));
export const delUser = (data) => request.delete('/admin/user', JSON.stringify(data));
export const banUser = (data) => request.post('/admin/ban', JSON.stringify(data));
export const getSurveys = () => request.get('/admin/surveys');
export const getSurvey = (id) => request.get('/admin/survey/' + id);
export const addSurvey = (data) => request.post('/admin/addSurvey', JSON.stringify(data));
export const addQuestion = (data) => request.post('/admin/addQuestion', JSON.stringify(data));
export const reviewedResponse = (data) => request.post('/admin/reviewed', JSON.stringify(data));
export const responseDetail = (id) => request.get('/admin/detail/' + id);
export const detailScore = (data) => request.post('/admin/detail_score', JSON.stringify(data));
export const getQuestionType = () => request.get('/admin/question_type');
export const setQuestionType = (data) => request.put('/admin/question_type', JSON.stringify(data));

