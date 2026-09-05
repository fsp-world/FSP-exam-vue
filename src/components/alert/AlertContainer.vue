<script setup lang="ts">
import { useAlertStore } from '@/stores/alert';
import AlertItem from './AlertItem.vue';
import { storeToRefs } from 'pinia';

const alertStore = useAlertStore();
const { dialogs } = storeToRefs(alertStore);
</script>

<template>
  <TransitionGroup class="alert-container" name="list" tag="ul">
    <li v-for="item in dialogs" :key="item.title + item.message">
      <AlertItem :card="item"></AlertItem>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.alert-container {
  position: fixed;
  left: 50%;
  width: min(432px, calc(100vw - 32px));
  margin: 0;
  padding: 0;
  list-style: none;
  transform: translateX(-50%);
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
