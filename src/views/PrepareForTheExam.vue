<script setup>
import { ref } from 'vue';
import MCButton from '@/components/MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import InfoConfirmDialog from '@/components/InfoConfirmDialog.vue';
import { getProfilePic } from '@/apis/mj';
import { getSlotsAPI, startSurvey, checkSurvey } from '@/apis/survey';
import { openAlert } from '@/utils/TsAlert';
import { useRouter } from 'vue-router';

const router = useRouter();

const checkSurvey_ = () => {
  checkSurvey().then((res) => {
    if (res.data.code === 1) {
      openAlert(res.data.desc);
      router.push({ name: 'Examination', params: { sid: res.data.response } });
    }
  });
};

const examineeInfo = ref({
  playerName: '',
  playerUUID: 'none',
  sid: undefined,
  imgUrl: 'none',
});

const flag = ref(false);

const surveyList = ref([]);

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

const choiceSurvey = (sid) => {
  examineeInfo.value.sid = sid;
};

const checkRefDataNotNull = (data) => {
  for (const [key, value] of Object.entries(data.value)) {
    if (value === '' || value === undefined) {
      return false;
    }
  }
  return true;
};

const startExam = () => {
  if (!checkRefDataNotNull(examineeInfo)) {
    openAlert('请填写个人信息并选择类型');
  } else {
    checkPlayerName(examineeInfo.value.playerName);
  }
};

const handelConfirm = () => {
  flag.value = false;
  startSurvey(examineeInfo.value).then((res) => {
    if (res.data.code === 0) {
      openAlert(res.data.desc);
      router.push({ name: 'Examination', params: { sid: res.data.response } });
    } else {
      openAlert(res.data.desc);
    }
  });
};

// 检查用户有没有未完成的问卷
checkSurvey_();
getSlotsAPI().then((res) => {
  surveyList.value = res.data.list;
});
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
            <h1>我们会通过一些题目来确认您大致的游戏水平</h1>
          </div>
          <form class="examineeInfo">
            <input type="text" v-model="examineeInfo.playerName" placeholder="您的游戏昵称" />
            <p>系统会根据您的选择生成定制的试题</p>
            <ul class="option-list">
              <li
                class="option"
                :class="{
                  selected: examineeInfo.sid == item.mountedSID,
                }"
                v-for="(item, index) in surveyList"
                v-bind:key="index"
                @click="choiceSurvey(item.mountedSID)"
              >
                {{ item.slotName }}类
              </li>
              <p v-if="surveyList.length === 0" style="font-size: 30px; text-align: center; margin: 0 auto">
                暂无可用的问卷
              </p>
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
  --hei: 70px;
  height: var(--hei);
  width: 50%;
  font-size: 25px;
  line-height: var(--hei);
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
@media screen and (max-width: 750px) {
  .examineeInfo {
    padding: 10px;
    margin: 0 0px 10px 0px;
  }
  .examineeInfo .option-list .option {
    --hei: 58px;
  }
}
</style>
