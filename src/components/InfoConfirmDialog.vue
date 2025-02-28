<script setup>
const { show, dialogType, dialogStyle } = defineProps({
  show: Boolean,
  info: Object,
});

const emit = defineEmits(['confirm', 'close']);

const send = () => {
  emit('confirm');
};
</script>

<template>
  <div class="dialog" :class="{ 'dialog-show': show, 'dialog-close': !show }">
    <div class="top">
      <img class="player-pic" :src="info.imgUrl" />
      <p class="player-name">Name: {{ info.playerName }}</p>
      <button class="minecraft-button button confirm-btn" type="button" @click="send()">确认无误</button>
    </div>
    <p class="bottom player-uuid">uuid: {{ info.uuid }}</p>
  </div>
</template>

<style scoped>
.dialog {
  width: 600px;
  height: 120px;
  display: block;
  position: fixed;
  image-rendering: pixelated;
  font-family: 'mc-font';
  font-size: 23px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 5px;
  z-index: 100;
  left: 50%;
  transform: translate(-50%, 0);
  text-align: center;
  transition: opacity 0.3s ease-in-out, bottom 0.3s ease-in-out;
}
.dialog-show {
  bottom: 150px;
  opacity: 1;
  visibility: visible;
}
.dialog-close {
  bottom: 120px;
  opacity: 0;
  visibility: hidden;
}
.info-card {
  color: #313131;
  background-image: url(../assets/images/vanilla_gui/demo_background.png);
}
</style>

