import request from '@/utils/requers';
import { sortQuestion } from '@/utils/survey';
import type { FetchResponse } from '@/types';
import type { AnswerSurvey, AnsweredSurvey } from '@/types/survey';

interface slot {
  id: number;
  slotName: string;
  mountedSID: number;
}

export const getSlotsAPI = (): Promise<FetchResponse<slot[]>> =>
  request.get('/survey/get_slots');

export const getSurvey = async (
  id: number,
): Promise<FetchResponse<AnswerSurvey>> => {
  try {
    const response = await request.get('/survey/survey/' + id);
    response.data.questions = sortQuestion(response.data.questions);
    return response;
  } catch (error) {
    console.error('Error fetching survey:', error);
    throw error;
  }
};

export const checkSurvey = (): Promise<FetchResponse<number>> =>
  request.post('/survey/check_survey');

export interface ExamineeInfo {
  playerName: string;
  playerUUID: string;
  sid: number;
  slotName: string;
}

export const startSurvey = (
  data: ExamineeInfo,
): Promise<FetchResponse<number>> =>
  request.post('/survey/start_survey', JSON.stringify(data));

export const completeSurvey = (
  data: AnsweredSurvey,
): Promise<FetchResponse<number>> =>
  request.post('/survey/complete_survey', data);
