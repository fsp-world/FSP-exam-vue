import type { ConfigItem, IPagination, IQuestion, ISurvey, IUser, SurveySlot } from '@/types';
import request from '@/utils/requers';
import { sortQuestion } from '@/utils/sortQuestion';

// user
export const getUsers = (data: IPagination) => request.get('/admin/users', { params: data });
export const getUser = (id: number) => request.get('/admin/user', { params: { id } });
export const addUser = (data: IUser) => request.post('/admin/user', JSON.stringify(data));
export const updateUser = (data: IUser) => request.put('/admin/user', JSON.stringify(data));

// whitelist
export const getWhitelist = (data: IPagination) => request.get('/admin/whitelist', { params: data });

// survey
export const getSurveys = () => request.get('/admin/surveys');
export const getSurvey = async (id: number) => {
  try {
    const response = await request.get('/admin/survey/' + id);
    response.data.questions = sortQuestion(response.data.questions);
    return response;
  } catch (error) {
    console.error('Error fetching survey:', error);
    throw error;
  }
};

export const addSurvey = (data: ISurvey) => request.post('/admin/addSurvey', JSON.stringify(data));
export const addSurveyAPI = (data: ISurvey) => request.post('/admin/addSurvey', JSON.stringify(data));
export const delSurvey = (data: number) => request.post('/admin/delSurvey', JSON.stringify(data));
export const modSurveyMetaData = (data: ISurvey) => request.post('/admin/modSurvey', JSON.stringify(data));

// question
export const addQuestionAPI = (data: IQuestion[]) => request.post('/admin/addQuestion', JSON.stringify(data));
export const editQuestionAPI = (data: IQuestion) => request.post('/admin/editQuestion', JSON.stringify(data));
export const delQuestionAPI = (data: number) => request.post('/admin/delQuestion', JSON.stringify(data));
export const sortQuestionsAPI = (data: Array<{ id: number; display_order: number }>) =>
  request.post('/admin/sortSurveyQuestions', JSON.stringify(data));
export const migrationQuestionAPI = (data: { target_sid: number; qid: number }) =>
  request.post('/admin/migrationQuestion', JSON.stringify(data));

// response
export const getResponses = (data: IPagination) => request.get('/admin/responses', { params: data });
export const reviewedResponse = (data: { response: number; status: number }) =>
  request.post('/admin/reviewed', JSON.stringify(data));

export const responseDetail = async (id: number) => {
  try {
    const response = await request.get('/admin/detail/' + id);
    response.data.questions = sortQuestion(response.data.questions);
    return response;
  } catch (error) {
    console.error('Error fetching survey:', error);
    throw error;
  }
};

export const detailScore = (data: { score: number; questionId: number; responseId: number }) =>
  request.post('/admin/detail_score', JSON.stringify(data));

// slot
export const addSlotAPI = (data: SurveySlot) => request.post('/admin/add_slot', JSON.stringify(data));
export const setSlotAPI = (data: SurveySlot) => request.post('/admin/set_slot', JSON.stringify(data));
export const delSlotAPI = (data: SurveySlot) => request.post('/admin/del_slot', JSON.stringify(data));

// guarantee
export const getGuaranteeAPI = (data: IPagination) => request.get('/admin/guarantee/get', { params: data });

// config
export const getConfig = (data: string = '') => request.get('/admin/config', { params: { key: data } });
export const getConfigs = () => request.get('/admin/config');
export const setConfig = (data: ConfigItem) => request.post('/admin/config', JSON.stringify(data));
