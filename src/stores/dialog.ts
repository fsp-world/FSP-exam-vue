import { defineStore } from 'pinia'

export const useDialogStore = defineStore('dialog', {
    state: () => {
        return {
            dialogs: [] as Array<IdialogData>
        }
    },
    actions: {
        openDialog(data: IdialogData): number {
            (this.dialogs as Array<IdialogData>).push(data)
            return 0
        },
        closeDialog(title: string) {
            let index = (this.dialogs as Array<IdialogData>).findIndex((item: IdialogData) => item.title === title);
            (this.dialogs as Array<IdialogData>).splice(index, 1)
        }
    }
})