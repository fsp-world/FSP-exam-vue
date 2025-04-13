import request from '@/utils/requers';
import { sortQuestion } from '@/utils/sortQuestion';

export const getSlotsAPI = () => request.get('/survey/get_slots');

export const getSurvey = async (id: any) => {
  try {
    const response = await request.get('/survey/survey/' + id);
    response.data.questions = sortQuestion(response.data.questions);
    return response;
  } catch (error) {
    console.error('Error fetching survey:', error);
    throw error;
  }
};

export const checkSurvey = () => request.post('/survey/check_survey');

export const startSurvey = (data = {}) => request.post('/survey/start_survey', JSON.stringify(data));

export const completeSurvey = (data: any) => request.post('/survey/complete_survey', data);
