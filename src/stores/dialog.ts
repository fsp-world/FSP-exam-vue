import { defineStore } from 'pinia'
import { IdialogData } from '@/utils/dialogType';

export const useDialogStore = defineStore('dialog', {
    state: () => {
        return {
            dialogs: [] as Array<IdialogData>
        }
    },
    actions: {
        openDialog(data: IdialogData): number {
            (this.dialogs as Array<IdialogData>).push(data)
            if (this.dialogs.length > 3) {
                (this.dialogs as Array<IdialogData>).splice(0, 1)
            }
            return 0
        },
        closeDialog(title: string) {
            let index = (this.dialogs as Array<IdialogData>).findIndex((item: IdialogData) => item.title === title);
            (this.dialogs as Array<IdialogData>).splice(index, 1)
        }
    }
})