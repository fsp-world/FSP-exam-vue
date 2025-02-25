<script setup>
import { ref } from 'vue';
const { type, x, y } = defineProps({
  type: String,
  x: Number,
  y: Number,
});
const sty = ref({
  transform: `translate(${x}px, ${y}px)`,
});
</script>

<template>
  <div class="bg-ore" :class="type" :style="sty"></div>
</template>

<style scoped>
.bg-ore {
  width: 130px;
  height: 130px;
  image-rendering: pixelated;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.iron {
  background-image: url(../assets/images/vanilla_gui/block/iron_ore.png);
}

.coal {
  background-image: url(../assets/images/vanilla_gui/block/coal_ore.png);
}
</style>
