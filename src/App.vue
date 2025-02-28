<script setup>
import { RouterView } from 'vue-router';
import Alert from '@/components/alert/Alert.vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

onMounted(() => {
  const store = useUserStore();
  store.checkLogin();
});
</script>

<template>
  <Teleport to="body">
    <Alert></Alert>
  </Teleport>
  <RouterView />
</template>

<style scoped></style>
