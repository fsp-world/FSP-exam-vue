export interface IalertData {
  type: CardType;
  title: string;
  message: string;
  age: number;
  flag: boolean;
}

export type CardType = 'warn-card' | 'info-card';

