export interface SurveySlot {
  id?: number;
  slotName: string;
  mountedSID: number;
}

export interface NewSurvey {
  id?: number;
  name: string;
  description: string;
}

export interface ViewSurvey extends NewSurvey {
  id: number;
  createTime: string;
  sumScore: number;
  questions: AdminViewQuestion[];
}

export interface Survey extends ViewSurvey {
  notCompletedCount: number;
  notReviewedCount: number;
  editable?: boolean;
  status?: number; // 查询问卷列表时，代表问卷是否被挂载；查询单个问卷时不携带该属性
}

export enum QuestionType {
  SingleChoice = 1,
  MultipleChoice = 2,
  FillInTheBlanks = 3,
  Subjective = 4,
}

export interface Option {
  id?: string; // 新建题目时候不携带 id
  text: string; // 选项文字，非用户作答状态，如果是填空题或者主观题，则为参考答案
  isSelected?: boolean; // 用户选择的选项
  isCorrect?: boolean; // 正确选项，用户作答时不存在此字段
  inputText?: string; // 如果是填空题或者主观题，内容为用户的作答
}

export interface Img {
  id?: number; // 编辑题目会用到
  alt: string;
  data: string;
}

interface BaseQuestion {
  display_order: number;
  title: string;
  type: QuestionType;
  typeText?: string;
  score: number; // 分值
  options: Option[];
  images: Img[];
}

// 用于用户作答
export interface UserViewQuestion extends BaseQuestion {
  id: number;
  userGetScore?: number;
  answer: string[]; //选择题内容是选择的选项的id，填空题和主观题数组第一个元素的值是用户输入
}

export interface CarryKeyOption extends Option {
  key: string;
}

interface CarryKeyImg extends Img {
  key: string;
}

export interface UploadEditQuestion extends BaseQuestion {
  id?: number;
  options: Option[];
  images: Img[];
}

export interface EditQuestion extends BaseQuestion {
  id?: number;
  options: CarryKeyOption[];
  images: CarryKeyImg[];
}

export interface EditQuestions {
  surveyId: number;
  questions: UploadEditQuestion[];
}

export interface AdminViewQuestion extends UserViewQuestion {
  id: number;
}

export interface AdminReviewQuestion extends AdminViewQuestion {
  // userGetScore: number;
}

export type ModeType = 'add' | 'edit';
