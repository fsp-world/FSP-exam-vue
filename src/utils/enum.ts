export enum QuestionType {
  SingleChoice = 1,
  MultipleChoice = 2,
  FillInTheBlanks = 3,
  Subjective = 4,
}

const objectiveQuestionTypes = [QuestionType.SingleChoice, QuestionType.MultipleChoice, QuestionType.FillInTheBlanks];

export function isObjectiveQuestion(type: QuestionType): boolean {
  return objectiveQuestionTypes.includes(type);
}
