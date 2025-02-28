<script setup>
import { useAlertStore } from '@/stores/alert';
import AlertCard from './AlertCard.vue';
import { storeToRefs } from 'pinia';

const alertStore = useAlertStore();
const { dialogs } = storeToRefs(alertStore);
</script>

<template>
  <!-- <div class="dialog-container">
        <template v-for="(item, index) of dialogs" :key="index">
            <Transition name="fade" mode="out-in">
                <DialogCard :card="item"></DialogCard>
            </Transition>
        </template>
    </div> -->
  <TransitionGroup class="alert-container" name="list" tag="ul">
    <li v-for="item in dialogs" :key="item">
      <AlertCard :card="item"></AlertCard>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.alert-container {
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
