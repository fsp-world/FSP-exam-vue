<script setup>
import { useDialogStore } from '@/stores/dialog'
import DialogCard from './DialogCard.vue'
import { storeToRefs } from 'pinia'

const dialogStore = useDialogStore()
const { dialogs } = storeToRefs(dialogStore)

</script>

<template>
    <div class="dialog-container">
        <DialogCard v-for="(item, index) of dialogs" :key="index" :card="item"></DialogCard>
    </div>
</template>

<style scoped>
.dialog-container {
    width: 400px;
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}
</style>