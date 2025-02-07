<script setup>
import { useDialogStore } from '@/stores/dialog'
import DialogCard from './DialogCard.vue'
import { storeToRefs } from 'pinia'

const dialogStore = useDialogStore()
const { dialogs } = storeToRefs(dialogStore)

</script>

<template>
    <div class="dialog-container">
        <Transition v-for="(item, index) of dialogs" :key="index" type="transition" name="fade" mode="out-in" appear>
            <DialogCard :card="item"></DialogCard>
        </Transition>
    </div>
</template>

<style scoped>
.dialog-container {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>