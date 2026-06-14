<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router';

import MCDialog from '@/components/MCDialog.vue';

const isShowModal = ref(true)
</script>

<template>
  <div class="background">
    <MCDialog class="dialog" :style="'book'" v-model:isModalVisible="isShowModal">
      <RouterView class="form" />
    </MCDialog>
  </div>
</template>

<style scoped>
a:visited {
  color: inherit;
}

.background {
  background-image: var(--bg-img);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
