<template>
  <button type="button" class="mc-button">
    <slot></slot>
  </button>
</template>

<script setup></script>

<style scoped>
.mc-button a {
  color: #fff;
}
.mc-button a:active {
  color: #fff;
}
.mc-button a:target {
  color: #fff;
}

.mc-button {
  font-family: 'mc-font';
  color: #fff;
  border-radius: 5px;
  background-image: url(../assets/images/rainbow_pixel_gui/button.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  image-rendering: pixelated;
}

.mc-button:hover {
  background-image: url(../assets/images/rainbow_pixel_gui/button_highlighted.png);
  image-rendering: pixelated;
}
</style>
