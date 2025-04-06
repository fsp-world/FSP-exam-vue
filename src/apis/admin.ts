import type { IPagination, IQuestion, ISurvey, IUser } from '@/types';
import request from '@/utils/requers';

// user
export const getUsers = (data: IPagination) => request.get('/admin/users', { params: data });
export const getUser = (id: number) => request.get('/admin/user', { params: { id } });
export const addUser = (data: IUser) => request.post('/admin/user', JSON.stringify(data));
export const updateUser = (data: IUser) => request.put('/admin/user', JSON.stringify(data));

// whitelist
export const getWhitelist = (data: IPagination) => request.get('/admin/whitelist', { params: data });

// survey
export const getSurveys = () => request.get('/admin/surveys');
export const getSurvey = (id: number) => request.get('/admin/survey/' + id);
export const addSurvey = (data: ISurvey) => request.post('/admin/addSurvey', JSON.stringify(data));
export const delSurvey = (data: number) => request.post('/admin/delSurvey', JSON.stringify(data));
export const modSurveyMetaData = (data: ISurvey) => request.post('/admin/modSurvey', JSON.stringify(data));

// question
export const getQuestionAPI = () => request.get('/admin/AllQuestion');
export const addQuestionAPI = (data: IQuestion) => request.post('/admin/addQuestion', JSON.stringify(data));
export const editQuestionAPI = (data: IQuestion) => request.post('/admin/editQuestion', JSON.stringify(data));
export const delQuestionAPI = (data: number) => request.post('/admin/delQuestion', JSON.stringify(data));

// response
export const getResponses = (data: IPagination) => request.get('/admin/responses', { params: data });
export const reviewedResponse = (data: { response: number; status: number }) =>
  request.post('/admin/reviewed', JSON.stringify(data));
export const responseDetail = (id: number) => request.get('/admin/detail/' + id);
export const detailScore = (data: { score: number; questionId: number; responseId: number }) =>
  request.post('/admin/detail_score', JSON.stringify(data));

// question_type 应该理解为问卷类型，我不知道为什么不叫 survey_type
export const getQuestionType = () => request.get('/admin/question_type');
export const setQuestionType = (data: { id: number; surveyId: number; typeName: string }) =>
  request.put('/admin/question_type', JSON.stringify(data));
