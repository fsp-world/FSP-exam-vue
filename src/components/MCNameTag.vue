<!-- <script setup lang="ts"></script> -->
<template>
  <span class="tag">
    <slot></slot>
  </span>
</template>
<style scoped>
/* 建议的父元素样式 */
/* .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 10px;
} */
.tag {
  background-color: rgba(255, 255, 255, 0.3);
  color: #333;
  line-height: 30px;
  padding-left: 3px;
  font-size: 14px;
  position: relative;
  background-image: url(/src/assets/images/rainbow_pixel_gui/name_tag_rt_m.png);
  background-size: 100% 100%;
  background-position: left;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  white-space: nowrap;
}

.tag::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 30px;
  bottom: 0px;
  left: -6px;
  background-image: url(/src/assets/images/rainbow_pixel_gui/name_tag_rt_l.png);
  background-size: 100% 100%;
  background-position: left;
  background-repeat: no-repeat;
  image-rendering: pixelated;

}

.tag::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 37px;
  bottom: 0px;
  right: -21px;
  background-image: url(/src/assets/images/rainbow_pixel_gui/name_tag_rt_r.png);
  background-size: 100% 100%;
  background-position: left;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}
</style>
