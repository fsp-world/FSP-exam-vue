<script setup>
import { RouterView } from 'vue-router'
import Dialog from "@/components/dialog/Dialog.vue"
import { useDialogStore } from '@/stores/dialog'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const dialogStore = useDialogStore()

let conunt = 1
const openDialog = () => {
    const data = {
        title: 'test' + conunt,
        type: 'info-card',
        message: '这是测试卡片',
        age: 1,
        flag: true
    }
    dialogStore.openDialog(data)
    console.log(data);
    conunt++
}

onMounted(() => {
    const store = useUserStore()
    store.checkLogin()
})

</script>

<template>
    <Dialog></Dialog>
    <!-- <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    -->
    <RouterView />
</template>

<style scoped></style>
