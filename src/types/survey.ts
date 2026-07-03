export interface NewOption {
  text: string; // 选项文字，非用户作答状态，如果是填空题或者主观题，则为参考答案
  isCorrect: boolean;
}

export interface NewImage {
  alt: string;
  data: string;
}

export interface QuestionImg {
  id: number;
  alt: string;
  data: string;
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface AdminViewOption extends AnswerOption {
  isCorrect: boolean;
  referenceAnswer: string;
}

export interface AdminReviewOption extends AdminViewOption {
  isSelected: boolean;
  userAnsweredText: string; // 填空题或主观题的用户作答内容
}

export enum QuestionType {
  SingleChoice = 1,
  MultipleChoice = 2,
  FillInTheBlanks = 3,
  Subjective = 4,
}

interface BaseQuestion {
  id: number;
  display_order: number;
  title: string;
  type: QuestionType;
  score: number;
  images: QuestionImg[];
}

export interface AnswerQuestion extends BaseQuestion {
  options: AnswerOption[];
}

export interface AdminViewQuestion extends BaseQuestion {
  options: AdminViewOption[];
}

export interface AdminReviewQuestion extends AdminViewQuestion {
  userGetScore: number;
  options: AdminReviewOption[];
}

export interface AnsweredSurvey {
  surveyId: number;
  answers: AnsweredQuestion[];
}

export interface AnsweredQuestion {
  id: number;
  answer: string[];
}

export type EditQuestionData = Omit<BaseQuestion, 'options' | 'images'> & {
  options: NewOption[];
  images: NewImage[];
};

export interface UploadEditQuestion {
  surveyId: number;
  question: EditQuestionData;
}
export interface UploadAddQuestion {
  surveyId: number;
  questions: EditQuestionData[];
}

export interface NewSurvey {
  id?: number;
  name: string;
  description: string;
}

export interface SurveyInfoItem extends NewSurvey {
  id: number;
  createTime: string;
  status: number;
  notCompletedCount: number;
  notReviewedCount: number;
  editable?: boolean;
}

export interface ImportSurvey extends NewSurvey {
  createTime: string;
  questions: EditQuestionData[];
}

// 待作答的问卷
export interface AnswerSurvey {
  id: number;
  name: string;
  description: string;
  startAnswerTime: string;
  ddl: string;
  questions: AnswerQuestion[];
}

export interface AdminViewSurvey {
  id: number;
  name: string;
  description: string;
  createTime: string;
  questions: AdminViewQuestion[];
}

export interface AdminReviewSurvey {
  id: number;
  name: string;
  description: string;
  createTime: string;
  isReviewed: boolean;
  questions: AdminReviewQuestion[];
}

export interface SurveySlot {
  id?: number;
  slotName: string;
  mountedSID: number;
}

export type ModeType = 'add' | 'edit';
