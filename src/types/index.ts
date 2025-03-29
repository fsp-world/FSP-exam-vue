export interface IPagination {
  page?: number
  size?: number
}

export interface IalertData {
  type: CardType;
  title: string;
  message: string;
  age: number;
  flag: boolean;
}

export type CardType = 'warn-card' | 'info-card';

export interface IResponse {
  id: number;
  isCompleted: string;
  isReviewed: string;
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
  responseTime: string;
  isReviewed: 0 | 1 | 2;
  score: number;
}

export interface ISurvey {
  name: string
  description: string
}

export type questionType = 1 | 2 | 3 | 4

export interface IOption {
  key: string;
  option: string;
  isAnswer: boolean;
}

export interface IQuestion {
  survey: number
  title: string
  type: questionType
  score: number;
  options: Array<IOption>;
  img_url: Array<string>;
}

export type roleType = 'admin' | 'user'

export type statusType = 0 | 1 | 2 | 3 | 4

export interface IUser {
  id?: number;
  username: string
  userQQ: string
  role?: roleType,
  password?: string
  status?: statusType
}