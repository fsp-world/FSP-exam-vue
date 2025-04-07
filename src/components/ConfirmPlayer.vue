<script setup>
import { ref, watch } from 'vue';
import { getProfilePic } from '@/apis/mj';
import { openAlert } from '@/utils/TsAlert';

import MCButton from './MCButton.vue';

const emit = defineEmits(['confirm']);

const check = defineModel('check'); // 父组件要定义一个叫check的ref，父组件只负责把check设置为true
const info = defineModel('info');
const show = ref(false);

const imgUrl = ref('');

const getPlayerInfo = () => {
  if (info.value.playerName) {
    openAlert('确认游戏名称中...');
    getProfilePic(info.value.playerName).then((result) => {
      if (result.msg === 'ok') {
        show.value = true;
        info.value.playerUUID = result.uuid;
        imgUrl.value = result.imgUrl;
      } else if (result.msg == 'No Minecraft user could be found.') {
        openAlert('该玩家不存在！');
        check.value = false;
      } else {
        openAlert(result.msg);
        check.value = false;
      }
    });
  } else {
    openAlert('请输入玩家名称');
  }
};
const isNotMe = () => {
  show.value = false;
  check.value = false;
};
const confirm = () => {
  show.value = false;
  check.value = false;
  emit('confirm');
};

watch(
  () => check.value,
  (newValue, _) => {
    if (newValue) {
      getPlayerInfo();
    }
  },
);
</script>

<template>
  <div class="dialog info-card" :class="{ 'dialog-show': show, 'dialog-close': !show }">
    <div class="userinfo">
      <img class="player-pic" :src="imgUrl" />
      <div class="name-and-uuid">
        <p class="player-name"><span>Name：</span>{{ info.playerName }}</p>
        <p class="player-uuid"><span>uuid：</span>{{ info.playerUUID }}</p>
      </div>
    </div>
    <div class="buttons">
      <MCButton class="minecraft-button button confirm-btn" type="button" @click="isNotMe">我打错了</MCButton>
      <MCButton class="minecraft-button button confirm-btn" type="button" @click="confirm">确认无误</MCButton>
    </div>
  </div>
</template>

<style scoped>
.dialog {
  width: 700px;
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
  padding: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.userinfo {
  display: flex;
  .player-pic {
    --hei: 70px;
    width: var(--hei);
    height: var(--hei);
    image-rendering: pixelated;
  }
  .name-and-uuid {
    text-align: left;
    padding-left: 20px;
    .player-name {
      font-size: 30px;
    }
    .player-uuid {
      font-size: 24px;
      line-height: 1.5em;
      text-align: center;
    }
  }
}
.buttons {
  display: flex;
  gap: 10px;
  .confirm-btn {
    width: 200px;
    height: 50px;
    font-size: 24px;
  }
}

@media (max-width: 760px) {
  .dialog {
    width: 92%;
    height: 120px;
  }
  .userinfo {
    margin-bottom: 10px;
    span {
      display: none;
    }
    .player-name {
      line-height: 70px;
    }
    .player-uuid {
      display: none;
    }
  }
}
</style>
