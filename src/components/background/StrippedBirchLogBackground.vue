<script setup lang="ts">

</script>

<template>
  <div class="back-ground">
    <div class="bga grass"></div>
    <div class="bga log"></div>
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

  .log {
    background-image: url(/src/assets/images/vanilla_gui/block/stripped_birch_log.png);
    top: var(--block-hei);
    height: calc(100% - var(--block-hei));
    z-index: 0;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  }
}

.slot-content {
  width: 100%;
  position: relative;
  top: 0;
  z-index: 2;
}
</style>
