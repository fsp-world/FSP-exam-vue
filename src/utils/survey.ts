import type { Survey, Question } from '@/types/survey';
import { QuestionType } from '@/types/survey';
import { addSurveyAPI, addQuestionAPI, getSurvey } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';

interface ReturnData {
  success: boolean;
  msg: string;
}

export const sortQuestion = (questionList: Question[]): Question[] => {
  // 方法：返回按 display_order 排序后的数组
  return questionList.slice().sort((a, b) => a.display_order - b.display_order);
};

export const getStringQuestionType = (questionType: QuestionType): string => {
  switch (questionType) {
    case QuestionType.SingleChoice:
      return '单选题';
    case QuestionType.MultipleChoice:
      return '多选题';
    case QuestionType.FillInTheBlanks:
      return '填空题';
    case QuestionType.Subjective:
      return '主观题';
    default:
      return '未知题';
  }
};

const objectiveQuestionTypes = [
  QuestionType.SingleChoice,
  QuestionType.MultipleChoice,
  QuestionType.FillInTheBlanks,
];

export function isObjectiveQuestion(type: QuestionType): boolean {
  return objectiveQuestionTypes.includes(type);
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
      return {
        success: true,
        msg: '问卷创建成功！',
        surveyId: res.data.data.surveyId,
      };
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

const addSurveyIdToQuestion = (
  questions: Question[],
  surveyId: number,
): Question[] => {
  return questions.map((item) => ({
    ...item,
    surveyId: surveyId,
  }));
};

const addDefaultAttributeToQuestion = (questions: Question[]): Question[] => {
  return questions.map((item) => ({
    ...item,
    display_order: 0,
  }));
};

export const importSurveyData = async (
  jsonData: Survey,
): Promise<ReturnData> => {
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

  jsonData.questions = addSurveyIdToQuestion(
    jsonData.questions,
    addSurveyRes.surveyId,
  );
  jsonData.questions = addDefaultAttributeToQuestion(jsonData.questions);
  const addQuestionsRes = await addQuestions(jsonData);
  if (!addQuestionsRes.success) {
    return addQuestionsRes;
  }
  openAlert(addQuestionsRes.msg);

  return { success: true, msg: '导入成功！' };
};

export const exportSurveyToJsonFile = async (surveyId: number) => {
  try {
    const res = await getSurvey(surveyId);
    if (res.data.code === 1) {
      openAlert(res.data.desc);
      return;
    }

    openAlert('开始导出');
    const jsonString = JSON.stringify(res.data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${res.data.name}.json`;
    a.click();
    openAlert('导出成功！');
  } catch (error) {
    openAlert('获取问卷失败！');
  }
};
