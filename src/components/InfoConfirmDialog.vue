<script setup>
import MCButton from './MCButton.vue';

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
  <div class="dialog info-card" :class="{ 'dialog-show': show, 'dialog-close': !show }">
    <div class="top">
      <div class="userinfo">
        <img class="player-pic" :src="info.imgUrl" />
        <p class="player-name">
          <span class="tip">Name：</span><span>{{ info.playerName }}</span>
        </p>
      </div>
      <MCButton class="minecraft-button button confirm-btn" type="button" @click="send()">确认无误</MCButton>
    </div>
    <p class="player-uuid">uuid: {{ info.playerUUID }}</p>
  </div>
</template>

<style scoped>
.dialog {
  width: 730px;
  height: 150px;
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
  transition:
    opacity 0.3s ease-in-out,
    bottom 0.3s ease-in-out;
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

.top {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding-top: 20px;
  flex-wrap: nowrap;
  .userinfo {
    --hei: 70px;
    display: flex;
    .player-pic {
      width: var(--hei);
      image-rendering: pixelated;
    }
    .player-name {
      padding-left: 20px;
      line-height: var(--hei);
      font-size: 30px;
      display: inline;
    }
  }
  .confirm-btn {
    width: 200px;
    height: 50px;
    font-size: 1.35rem;
  }
}

.player-uuid {
  line-height: 50px;
  text-align: center;
}
@media (max-width: 1200px) {
  .dialog {
    width: 95%;
    height: 150px;
  }
  .top {
    flex-wrap: wrap;
    .userinfo {
      --hei: 50px;
      .tip {
        display: none;
      }
    }
    .confirm-btn {
      width: 120px;
    }
  }
  .player-uuid {
    display: none;
  }
}
</style>
