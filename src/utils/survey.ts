import type { IQuestion } from '@/types';
import { addSurveyAPI, addQuestionAPI } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';

interface Survey {
  name: string;
  description: string;
  create_time: string;
  questions: IQuestion[];
}

interface ReturnData {
  success: boolean;
  msg: string;
}

const isFormatCorrect = (jsonData: Survey): ReturnData => {
  if (!jsonData.description || !jsonData.name || !jsonData.questions) {
    return { success: false, msg: 'json文件损坏，无法导入！' };
  }
  return { success: true, msg: '数据格式校验成功' };
};

const addSurvey = async (jsonData: Survey): Promise<any> => {
  try {
    const addSurveyData = {
      name: jsonData.name,
      description: jsonData.description,
    };
    const res = await addSurveyAPI(addSurveyData);
    if (res.data.code === 0) {
      return { success: true, msg: '问卷创建成功！', surveyId: res.data.surveyId };
    }
    return { success: false, msg: res.data.desc || '问卷创建失败！' };
  } catch (error) {
    console.error('问卷创建失败！', error);
    return { success: false, msg: '网络请求失败！' };
  }
};

const addQuestions = async (jsonData: Survey): Promise<ReturnData> => {
  try {
    const res = await addQuestionAPI(jsonData.questions);
    if (res.data.code === 0) {
      return { success: true, msg: '题目添加成功！' };
    }
    return { success: false, msg: res.data.desc || '题目添加失败！' };
  } catch (error) {
    console.error('题目添加失败！', error);
    return { success: false, msg: '网络请求失败！' };
  }
};

const addSurveyIdToQuestion = (questions: IQuestion[], surveyId: number): IQuestion[] => {
  return questions.map((item) => ({
    ...item,
    surveyId: surveyId,
  }));
};
const addDefaultAttributeToQuestion = (questions: IQuestion[]): IQuestion[] => {
  return questions.map((item) => ({
    ...item,
    display_order: 0,
  }));
};
export const importSurveyData = async (jsonData: Survey): Promise<ReturnData> => {
  const formatCheck = isFormatCorrect(jsonData);
  if (!formatCheck.success) {
    return formatCheck;
  }
  openAlert(formatCheck.msg);

  const addSurveyRes = await addSurvey(jsonData);
  if (!addSurveyRes.success) {
    return addSurveyRes;
  }
  openAlert(addSurveyRes.msg);

  jsonData.questions = addSurveyIdToQuestion(jsonData.questions, addSurveyRes.surveyId);
  jsonData.questions = addDefaultAttributeToQuestion(jsonData.questions);
  const addQuestionsRes = await addQuestions(jsonData);
  if (!addQuestionsRes.success) {
    return addQuestionsRes;
  }
  openAlert(addQuestionsRes.msg);

  return { success: true, msg: '导入成功！' };
};
