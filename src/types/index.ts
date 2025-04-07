export interface IPagination {
  page?: number;
  size?: number;
}

export interface IalertData {
  type: CardType;
  title: string;
  message: string;
  age: number;
  flag: boolean;
}

export interface SurveySlot {
  id?: number;
  slotName: string;
  mountedSID: number;
}

export type CardType = 'warn-card' | 'info-card';

export interface IResponse {
  id: number;
  isCompleted: string;
  isReviewed: number;
  username: string;
  survey: string;
  surveyId: number;
  score: number;
  playername: string;
  responseTime: string;
  createTime: string;
}

export interface IQueryResponse {
  id: number;
  type: string;
  survey_name?: string;
  responseTime: string;
  state: 0 | 1 | 2;
  get_score: number;
  full_score: number;
}

export interface ISurvey {
  id?: number;
  name: string;
  description: string;
  createTime?: string;
  status?: number;
}

export const getStringQuestionType = (questionType: number): string => {
  switch (questionType) {
    case 1:
      return '单选题';
    case 2:
      return '多选题';
    case 3:
      return '填空题';
    case 4:
      return '主观题';
    default:
      return '未知题';
  }
};

export interface IImg {
  id?: number; // 编辑题目会用到
  alt: string;
  data: string;
}

export interface IOption {
  id?: string; // 新建题目时候不携带 id
  text: string; // 选项文字，非用户作答状态，如果是填空题或者主观题，则为参考答案
  isSelected?: boolean; // 用户选择的选项
  isCorrect?: boolean; // 正确选项，用户作答时不存在此字段
  inputText?: string; // 如果是填空题或者主观题，内容为用户的作答
}

export interface IQuestion {
  id?: number;
  title: string;
  type: 1 | 2 | 3 | 4;
  typeText?: string;
  score: number; // 分值
  userGetScore?: number; // 用户得分
  img_list: IImg[];
  options: IOption[];
  answer?: string[]; // 用于用户作答，选择题内容是选择的选项的id，填空题和主观题数组第一个元素的值是用户输入
}

export type roleType = 'admin' | 'user';

export type statusType = 0 | 1 | 2 | 3 | 4;

export interface IUser {
  id?: number;
  username: string;
  userQQ: string;
  role?: roleType;
  password?: string;
  status?: statusType;
}
