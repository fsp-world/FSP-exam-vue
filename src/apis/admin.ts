import type {
  ConfigItem,
  IPagination,
  IQuestion,
  ISurvey,
  NewSurvey,
  User,
  UserUpdate,
  SurveySlot,
} from '@/types';
import request from '@/utils/requers';
import { sortQuestion } from '@/utils/sortQuestion';

// user
export const getUsers = (data: IPagination) =>
  request.get('/admin/users', { params: data });
export const getUser = (id: number) =>
  request.get('/admin/user', { params: { id } });
export const addUser = (data: User) =>
  request.post('/admin/user', JSON.stringify(data));
export const updateUser = (data: UserUpdate) =>
  request.put('/admin/user', JSON.stringify(data));
export const deleteUser = (id: number) =>
  request.delete('/admin/user', { data: JSON.stringify({ id }) });

// whitelist
export const getWhitelist = (data: IPagination) =>
  request.get('/admin/whitelist', { params: data });

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

export const addSurvey = (data: NewSurvey) =>
  request.post('/admin/survey/add', JSON.stringify(data));
export const addSurveyAPI = (data: NewSurvey) =>
  request.post('/admin/survey/add', JSON.stringify(data));
export const delSurvey = (id: number) =>
  request.post('/admin/survey/delete', JSON.stringify({ id }));
export const modSurveyMetaData = (data: ISurvey) =>
  request.post('/admin/survey/update', JSON.stringify(data));

// question
export const addQuestionAPI = (data: IQuestion[]) =>
  request.post('/admin/question/add', JSON.stringify(data));
export const editQuestionAPI = (data: IQuestion) =>
  request.post('/admin/question/edit', JSON.stringify(data));
export const delQuestionAPI = (id: number) =>
  request.post('/admin/question/delete', JSON.stringify({ id }));
export const sortQuestionsAPI = (
  data: Array<{ id: number; display_order: number }>,
) => request.post('/admin/question/sort', JSON.stringify(data));
export const migrationQuestionAPI = (data: {
  target_sid: number;
  qid: number;
}) => request.post('/admin/question/migration', JSON.stringify(data));

// response
export const getResponses = (data: IPagination) =>
  request.get('/admin/responses', { params: data });
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

export const detailScore = (data: {
  score: number;
  questionId: number;
  responseId: number;
}) => request.post('/admin/detail_score', JSON.stringify(data));

// slot
export const addSlotAPI = (data: SurveySlot) =>
  request.post('/admin/slot/add', JSON.stringify(data));
export const setSlotAPI = (data: SurveySlot) =>
  request.post('/admin/slot/set', JSON.stringify(data));
export const delSlotAPI = (data: SurveySlot) =>
  request.post('/admin/slot/delete', JSON.stringify(data));

// guarantee
export const getGuaranteeAPI = (data: IPagination) =>
  request.get('/admin/guarantee/get', { params: data });

// config
export const getConfig = (data: string = '') =>
  request.get('/admin/config/get', { params: { key: data } });
export const getConfigs = () => request.get('/admin/config/get');
export const setConfig = (data: ConfigItem) =>
  request.post('/admin/config/set', JSON.stringify(data));
export const deleteConfig = (data: string) =>
  request.post('/admin/config/delete', JSON.stringify(data));
