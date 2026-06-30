<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
import AlertCard from './AlertCard.vue';
import { storeToRefs } from 'pinia';

const alertStore = useAlertStore();
const { dialogs } = storeToRefs(alertStore);
</script>

<template>
  <TransitionGroup class="alert-container" name="list" tag="ul">
    <li v-for="item in dialogs" :key="item.title + item.message">
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
