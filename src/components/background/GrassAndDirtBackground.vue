<script setup lang="ts">

</script>

<template>
  <div class="back-ground">
    <div class="bga grass"></div>
    <div class="bga dirt"></div>
  </div>
  <div class="slot-content">
    <slot></slot>
  </div>
</template>

<style scoped>
.back-ground {
  width: 100%;
  min-height: 100vh;
  position: absolute;
  top: 0;
  overflow-x: hidden;

  .bga {
    --block-hei: 130px;
    width: 100%;
    image-rendering: pixelated;
    position: absolute;
    background-repeat: repeat;
    background-size: var(--block-hei) var(--block-hei);
  }

  .grass {
    background-image: url(/src/assets/images/vanilla_gui/block/grass_block_side.png);
    top: 0;
    height: var(--block-hei);
    z-index: 0;
  }

  .dirt {
    background-image: url(/src/assets/images/vanilla_gui/block/dirt.png);
    top: var(--block-hei);
    height: calc(100% - var(--block-hei));
    z-index: 0;
  }
}

.slot-content {
  width: 100%;
  position: relative;
  top: 0;
  z-index: 2;
}
</style>
