import { defineStore } from 'pinia';
import { IdialogData } from '@/utils/dialogType';

export const useDialogStore = defineStore('dialog', {
  state: () => {
    return {
      dialogs: [] as Array<IdialogData>,
      lock: false as boolean,
    };
  },
  actions: {
    openDialog(data: IdialogData): number {
      (this.dialogs as Array<IdialogData>).push(data);
      if (this.dialogs.length > 3) {
        (this.dialogs as Array<IdialogData>).splice(0, 1);
      }
      return 0;
    },
    closeDialog() {
      let li: IdialogData[] = [];
      let tsMap = (arr: IdialogData[], callback: Function) => {
        arr.forEach((item) => {
          if (!callback(item)) {
            li.push;
          }
        });
      };
      tsMap(this.dialogs, (item: IdialogData) => {
        if (item.flag) {
          return item;
        }
        return null;
      });
      this.dialogs = li;
    },
  },
});
