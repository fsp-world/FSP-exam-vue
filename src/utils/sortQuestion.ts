import { IQuestion } from '@/types';

export const sortQuestion = (questionList: IQuestion[]): IQuestion[] => {
  // 方法：返回按 display_order 排序后的数组
  return questionList.slice().sort((a, b) => a.display_order - b.display_order);
};
