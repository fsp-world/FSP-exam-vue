<script setup>
import { useDialogStore } from '@/stores/dialog'
import DialogCard from './DialogCard.vue'
import { storeToRefs } from 'pinia'

const dialogStore = useDialogStore()
const { dialogs } = storeToRefs(dialogStore)

</script>

<template>
    <!-- <div class="dialog-container">
        <template v-for="(item, index) of dialogs" :key="index">
            <Transition name="fade" mode="out-in">
                <DialogCard :card="item"></DialogCard>
            </Transition>
        </template>
    </div> -->
    <TransitionGroup  class="dialog-container" name="list" tag="ul">
        <li v-for="item in dialogs" :key="item">
            <DialogCard :card="item"></DialogCard>
        </li>
    </TransitionGroup>
</template>

<style scoped>
.dialog-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(100px);
}
</style>