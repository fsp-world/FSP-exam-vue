<script setup>
import { ref, watch } from 'vue';
import BackgroundOre from './BackgroundOre.vue';
function generatePatterns() {
  function generateNonOverlappingPositions(count) {
    const positions = [];
    while (positions.length < count) {
      const x = Math.floor(Math.random() * (maxX + 1));
      const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
      const newPosition = { x, y };
      // 检查新位置是否与现有位置重叠
      const isOverlapping = positions.some(
        (pos) => Math.abs(pos.x - newPosition.x) < elementSize && Math.abs(pos.y - newPosition.y) < elementSize,
      );

      if (!isOverlapping) {
        positions.push(newPosition);
      }
    }
    return positions;
  }
  const elementSize = 130;
  // 不希望矿石生成在草方块、泥土或者基岩里！
  const maxX = window.innerWidth - elementSize;
  const minY = elementSize * 2;
  const maxY = bgHeight.value - elementSize * 2;
  const area = maxX * maxY;
  const k = area * 0.000001; // 建议控制在 3 ~ 10，否则严重影响客户端性能
  const count = k * 8;
  const positions = generateNonOverlappingPositions(count);
  const srcList = ['iron', 'coal'];
  for (let i = 0; i < count; i++) {
    bgStonePatterns.value.push({
      type: srcList[Math.floor(Math.random() * srcList.length)],
      x: positions[i].x,
      y: positions[i].y,
    });
  }
}
const bgStonePatterns = ref([]);
const props = defineProps({
  flag: Boolean,
});

const bgHeight = ref(0);
watch(bgHeight, (newVal, oldVal) => {
  if (props.flag) {
    generatePatterns();
  }
});
</script>

<template>
  <div class="back-ground" :ref="(el) => (bgHeight = el.offsetHeight)">
    <div class="bga grass"></div>
    <div class="bga stone"></div>
    <div class="bga deepslate"></div>
    <div class="bga bedrock"></div>
    <div class="bga ore">
      <BackgroundOre v-for="img in bgStonePatterns" :type="img.type" :x="img.x" :y="img.y"></BackgroundOre>
    </div>
    <div class="slot-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.back-ground {
  width: 100%;
  min-height: 100vh;
  position: relative;
  top: 0;
  overflow-x: hidden;
}

.slot-content {
  position: relative;
  width: 100%;
  z-index: 3;
  top: 0;
}

.bga {
  background-size: 130px 130px;
  width: 100%;
  height: 130px;
  image-rendering: pixelated;
  background-repeat: repeat-x;
  position: absolute;
}

.grass {
  background-image: url(../assets/images/vanilla_gui/long-grass.png);
  top: 0;
  z-index: 1;
  height: 260px;
  background-size: 130px 260px;
}

.stone {
  background-image: url(../assets/images/vanilla_gui/block/stone.png);
  height: 50%;
  background-repeat: repeat;
  z-index: 0;
}

.deepslate {
  background-image: url(../assets/images/vanilla_gui/block/deepslate.png);
  background-repeat: repeat;
  height: 50%;
  bottom: 0;
  z-index: 0;
}

.bedrock {
  background-image: url(../assets/images/vanilla_gui/block/bedrock.png);
  bottom: 0;
  z-index: 1;
}

.ore {
  top: 0;
  z-index: 2;
}
</style>
