import { useAlertStore } from '@/stores/alert';
import { CardType, IalertData } from '@/types';

const alertStore = useAlertStore();

export function openAlert(inData: string): void;
export function openAlert(inData: string, type: CardType): void;
export function openAlert(inData: IalertData): void;
export function openAlert(inData: string | IalertData, type: CardType = 'info-card'): void {
  if (typeof inData === 'string') {
    const data: IalertData = {
      title: Date(),
      type: type,
      message: inData,
      age: 3000,
      flag: true,
    };
    alertStore.openAlert(data as IalertData);
  } else {
    alertStore.openAlert(inData as IalertData);
  }
}
