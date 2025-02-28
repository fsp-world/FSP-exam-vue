<script setup lang="ts">
import { onMounted, onUnmounted, PropType } from 'vue';
import { IalertData } from '@/utils/alertType';
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();
const { card } = defineProps({
  card: {
    type: Object as PropType<IalertData>,
    required: true,
  },
});

let timeout: NodeJS.Timeout;

onMounted(() => {
  setTimeout(() => {}, 300);
  timeout = setTimeout(() => {
    close();
  }, card.age);
});

onUnmounted(() => {
  clearTimeout(timeout);
});

const close = () => {
  setTimeout(() => {
    card.flag = false;
    alertStore.closeAlert();
  }, 300);
};
</script>

<template>
  <div class="card" :class="[card.type]">
    {{ card.message }}
  </div>
</template>

<style scoped>
.card {
  max-width: 400px;
  min-height: 80px;
  margin: 16px;
  image-rendering: pixelated;
  font-size: 23px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 5px;
  padding: 12px 16px;
}

.warn-card {
  color: #cbcbcb;
  background-image: url(../../assets/images/rainbow_pixel_gui/system_info.png);
}

.info-card {
  color: #313131;
  background-image: url(../../assets/images/vanilla_gui/demo_background.png);
}
</style>
