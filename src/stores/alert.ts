import { defineStore } from 'pinia';
import { IalertData } from '@/types';

export const useAlertStore = defineStore('alert', {
  state: () => {
    return {
      dialogs: [] as Array<IalertData>,
    };
  },
  actions: {
    openAlert(data: IalertData): number {
      (this.dialogs as Array<IalertData>).push(data);
      if (this.dialogs.length > 3) {
        (this.dialogs as Array<IalertData>).splice(0, 1);
      }
      return 0;
    },
    closeAlert() {
      // 1
      // let li: IalertData[] = [];
      // let tsMap = (arr: IalertData[], callback: Function) => {
      //   arr.forEach((item) => {
      //     if (!callback(item)) {
      //       li.push(item);
      //     }
      //   });
      // };
      // tsMap(this.dialogs, (item: IalertData) => {
      //   if (item.flag) {
      //     return item;
      //   }
      //   return null;
      // });
      // this.dialogs = li;

      // 2
      this.dialogs = this.dialogs.filter((item: IalertData) => item.flag)
    },
  },
});
