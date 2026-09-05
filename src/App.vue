<script setup lang="ts">
import { RouterView } from 'vue-router';
import AlertContainer from '@/components/alert/AlertContainer.vue';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

onMounted(() => {
  const store = useUserStore();
  store.checkLogin().then(() => {
    // 同步用户自定义背景
    if (store.background) {
      document.documentElement.style.setProperty('--bg-img', `url('${store.background}')`);
    }
  });
});
</script>

<template>
  <Teleport to="body">
    <AlertContainer></AlertContainer>
  </Teleport>
  <RouterView />
</template>

<style scoped></style>
