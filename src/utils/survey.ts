import type {
  ImportSurvey,
  UploadAddQuestion,
  EditQuestionData,
  AnswerQuestion,
} from '@/types/survey';
import { QuestionType } from '@/types/survey';
import { addSurveyAPI, addQuestionAPI, getSurvey } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';

interface ReturnData {
  success: boolean;
  msg: string;
}

export const sortQuestion = <T extends { display_order: number }>(
  questionList: T[],
): T[] => {
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

/** 判断一道题是否已被作答 */
export function isQuestionAnswered(question: AnswerQuestion): boolean {
  const isChoice =
    question.type === QuestionType.SingleChoice ||
    question.type === QuestionType.MultipleChoice;
  return isChoice
    ? question.options.some((opt) => !!(opt as any).isSelected)
    : !!((question as any).answer?.[0] as string | undefined);
}

const objectiveQuestionTypes = [
  QuestionType.SingleChoice,
  QuestionType.MultipleChoice,
  QuestionType.FillInTheBlanks,
];

export function isObjectiveQuestion(type: QuestionType): boolean {
  return objectiveQuestionTypes.includes(type);
}

/** 检查选择题（单选/多选）是否至少有一个正确选项 */
/** 检查选择题是否有足够正确选项 */
export function hasSufficientCorrectOptions(question: EditQuestionData): {
  pass: boolean;
  hint: string;
} {
  if (
    question.type === QuestionType.FillInTheBlanks ||
    question.type === QuestionType.Subjective
  ) {
    return { pass: true, hint: '' };
  }

  const correctCount = question.options.filter((o) => o.isCorrect).length;

  if (correctCount === 0) {
    return { pass: false, hint: '请至少勾选一个正确选项' };
  }
  if (question.type === QuestionType.MultipleChoice && correctCount < 2) {
    return { pass: false, hint: '多选题请至少勾选两个正确选项' };
  }
  return { pass: true, hint: '' };
}

const isFormatCorrect = (jsonData: ImportSurvey): ReturnData => {
  if (
    !jsonData.description ||
    !jsonData.name ||
    !Array.isArray(jsonData.questions)
  ) {
    return { success: false, msg: 'json文件损坏，无法导入！' };
  }
  return { success: true, msg: '数据格式校验成功' };
};

const addSurvey = async (jsonData: ImportSurvey): Promise<any> => {
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

const addQuestions = async (data: UploadAddQuestion): Promise<ReturnData> => {
  for (const q of data.questions) {
    if (!q.title.trim()) {
      return { success: false, msg: '存在题目描述为空的题目，请检查！' };
    }
    const check = hasSufficientCorrectOptions(q);
    if (!check.pass) {
      return {
        success: false,
        msg: `题目「${q.title}」${check.hint}！`,
      };
    }
  }

  try {
    const res = await addQuestionAPI(data);
    if (res.data.code === 0) {
      return { success: true, msg: '题目添加成功！' };
    }
    return { success: false, msg: res.data.desc || '题目添加失败！' };
  } catch (error) {
    console.error('题目添加失败！', error);
    return { success: false, msg: '网络请求失败！' };
  }
};

export const importSurveyData = async (
  jsonData: ImportSurvey,
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

  const sendData: UploadAddQuestion = {
    surveyId: addSurveyRes.surveyId,
    questions: jsonData.questions.map((q) => ({ ...q, display_order: 0 })), // 重置排序
  };

  const addQuestionsRes = await addQuestions(sendData);
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

    const jsonString = JSON.stringify(
      res.data.data,
      (key, value) => {
        // 去除所有 ID，设置 display_order 为 0
        if (key === 'id') return undefined;
        if (key === 'display_order') return 0;
        return value;
      },
      2,
    );
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${res.data.data.name}.json`;
    a.click();
    openAlert('导出问卷成功！');
  } catch (error) {
    openAlert('获取问卷失败！');
  }
};
