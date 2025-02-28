export interface IalertData {
  type: CardType;
  title: string;
  message: string;
  age: number;
  flag: boolean;
}

type CardType = 'warn-card' | 'info-card';
