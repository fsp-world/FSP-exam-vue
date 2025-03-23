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
