import { useAlertStore } from '@/stores/alert';
import { CardType, IalertData } from '@/types';

const alertStore = useAlertStore();

export function openAlert(message: string): void;
export function openAlert(message: string, type: CardType): void;
export function openAlert(message: IalertData): void;
export function openAlert(message: string | IalertData, type: CardType = 'info-card'): void {
  if (typeof message === 'string') {
    const data: IalertData = {
      title: Date(),
      type: type,
      message: message,
      age: 3000,
      flag: true,
    };
    alertStore.openAlert(data);
  }

  alertStore.openAlert(message as IalertData);
}
