<script setup>
import { ref } from 'vue';
import MCButton from '@/components/MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import InfoConfirmDialog from '@/components/InfoConfirmDialog.vue';
import { getProfilePic } from '@/apis/mj';
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();
const openAlert = (message) => {
  const data = {
    title: 'conf' + Date(),
    type: 'info-card',
    message: message,
    age: 3000,
    flag: true,
  };
  alertStore.openAlert(data);
};

const examineeInfo = ref({
  // qqNumber: '',
  playerName: '',
  playerUUID: 'none',
  playerType: '',
  imgUrl: 'none',
});

const warnCard = ref({
  type: '',
  display: false,
  text: '',
  opacity: 1,
  imgUrl: '',
});

const flag = ref(false);

const playerTypeList = ref([
  { id: 'survival', option: '生存玩家' },
  { id: 'redstone', option: '红石玩家' },
  { id: 'construction', option: '建筑玩家' },
]);

const checkPlayerName = () => {
  openAlert('确认游戏名称中...');
  getProfilePic(examineeInfo.value.playerName).then((result) => {
    if (result.msg === 'ok') {
      examineeInfo.value.playerUUID = result.uuid;
      examineeInfo.value.imgUrl = result.imgUrl;
      flag.value = true;
    } else {
      openAlert(result.msg);
    }
  });
};

const choicePlayerType = (playerType) => {
  examineeInfo.value.playerType = playerType;
};

const checkRefDataNotNull = (data) => {
  for (const [key, value] of Object.entries(data.value)) {
    console.log(value);
    if (value === '' || value === undefined) {
      return false;
    }
  }
  return true;
};

const startExam = () => {
  if (!checkRefDataNotNull(examineeInfo)) {
    openAlert('请填写个人信息');
  } else {
    checkPlayerName(examineeInfo.value.playerName);
  }
};

const handelConfirm = () => {
  // 确认之后。。。
  // 比如发送请求
  console.log(examineeInfo.value);
  flag.value = false
};
</script>

<template>
  <InfoConfirmDialog :show="flag" :info="examineeInfo" @confirm="handelConfirm"></InfoConfirmDialog>
  <div class="prepare-exam-page">
    <div class="translucent-bg"></div>
    <div class="translucent-content">
      <div class="title">
        <p>参加考试</p>
      </div>
      <div class="main">
        <div>
          <div class="sub-title">
            <h1>在开始答题之前，我们需要知晓一些您的个人信息</h1>
            <p>请务必填写真实信息，否则系统可能无法正确添加白名单</p>
          </div>
          <form class="examineeInfo">
            <!-- <input
              type="number"
              v-model="examineeInfo.qqNumber"
              placeholder="您的QQ号"
              :class="{ 'input-red-color': warnCard.display }"
            /> -->

            <input
              type="text"
              v-model="examineeInfo.playerName"
              placeholder="您的游戏昵称"
              :class="{ 'input-red-color': warnCard.display }"
            />
            <p>我们会根据您的选择生成定制的试题</p>
            <ul class="option-list">
              <li
                class="option"
                :class="{
                  selected: examineeInfo.playerType == item.id,
                  'option-red-color': warnCard.display,
                }"
                v-for="(item, index) in playerTypeList"
                v-bind:key="index"
                @click="choicePlayerType(item.id)"
              >
                {{ item.option }}
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div class="end">
        <MCRouterLink to="/" class="button">返回</MCRouterLink>
        <MCButton class="button" @click="startExam"> 开始</MCButton>
      </div>
    </div>
  </div>
</template>
<style scoped>
.prepare-exam-page .main .sub-title {
  text-align: center;
  user-select: none;
}
.examineeInfo {
  padding: 10px;
  margin: 0 10px 10px 10px;
}

.examineeInfo p {
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  user-select: none;
}

.examineeInfo .option-list {
  display: flex;
  gap: 10px;
  user-select: none;
}

.examineeInfo .option-list .option {
  height: 70px;
  width: 50%;
  font-size: 25px;
  line-height: 70px;
  text-align: center;
  font-family: 'mc-font';
  color: #fff;
  border-radius: 5px;
  background-image: url(../assets/images/rainbow_pixel_gui/button.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  image-rendering: pixelated;
}

.examineeInfo .option-list .option:hover {
  background-image: url(../assets/images/rainbow_pixel_gui/button_highlighted.png);
  image-rendering: pixelated;
}

.examineeInfo .option-list .selected {
  background-image: url(../assets/images/rainbow_pixel_gui/button_highlighted.png);
  image-rendering: pixelated;
}
</style>
