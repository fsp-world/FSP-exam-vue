<script setup lang="ts">
import { ref, onMounted } from 'vue';

import MCButton from '@/components/MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue'
import MCSegmentedControl from '@/components/MCSegmentedControl.vue';

import ConfirmPlayer from '@/components/ConfirmPlayer.vue';
import { getSlotsAPI, startSurvey, checkSurvey } from '@/apis/survey';
import { openAlert } from '@/utils/TsAlert';
import { useRouter } from 'vue-router';
import type { SurveySlot } from '@/types/survey';
import type { ExamineeInfo } from '@/apis/survey'

const router = useRouter();

interface SurveyList {
  label: string,
  data: SurveySlot
}

const checkSurvey_ = () => {
  checkSurvey().then((res) => {
    if (res.data.code === 0) {
      openAlert(res.data.desc);
      router.push({ name: 'Examination', params: { sid: res.data.data } });
    }
    else if (res.data.code === 1) {
      openAlert(res.data.desc);
    }
  });
};

const examineeInfo = ref<ExamineeInfo>({
  playerName: '',
  playerUUID: 'none',
  sid: 0,
  slotName: ''
});

const check = ref(false);
const surveyList = ref<SurveyList[]>([]);
const selectedSurvey = ref<SurveySlot | null>(null)


const choiceSurvey = () => {
  if (selectedSurvey.value) {
    examineeInfo.value.sid = selectedSurvey.value.mountedSID;
    examineeInfo.value.slotName = selectedSurvey.value.slotName;
  }

};

// 已确认
const confirmed = () => {
  // 开始考试必须的三个参数：sid，mc-name，mc-uuid
  startSurvey(examineeInfo.value).then((res) => {
    if (res.data.code === 0 || res.data.code === 1) {
      openAlert(res.data.desc);
      router.push({ name: 'Examination', params: { sid: res.data.data } });
    } else {
      openAlert(res.data.desc);
    }
  });
};

// 用户点击开始按钮
const startExam = () => {
  // 检查用户是否填写必要信息
  if (examineeInfo.value.playerName && examineeInfo.value.sid) {
    // 这个组件只负责开启check，关闭check由confirm组件负责
    check.value = true;
  } else {
    openAlert('请填写个人信息并选择类型');
  }
};

onMounted(() => {
  // 检查用户有没有未完成的问卷
  checkSurvey_();
  // 获取可选的考试
  getSlotsAPI().then((res) => {
    surveyList.value = res.data.data.map((slot) => ({
      label: slot.slotName,
      data: slot
    }));
  });
});
</script>

<template>
  <ConfirmPlayer v-model:check="check" v-model:info="examineeInfo" @confirm="confirmed"></ConfirmPlayer>
  <div class="prepare-exam-page">
    <div class="translucent-bg"></div>
    <div class="translucent-content">
      <div class="title">
        <p>参加考试</p>
      </div>
      <div class="main">
        <form class="examinee-info">
          <div class="sub-title">
            我们会通过一些题目来确认您大致的游戏水平
          </div>
          <input class="minecraft-input" type="text" v-model="examineeInfo.playerName" placeholder="您的游戏昵称" />
          <p class="tips">系统会根据您的选择生成定制的试题</p>
          <MCSegmentedControl :button-length="'medium'" :data="surveyList" v-model="selectedSurvey"
            @change="choiceSurvey" class="option-list">
          </MCSegmentedControl>
          <p v-if="surveyList.length === 0" class="no-survey-available">
            暂无可用的问卷
          </p>
        </form>
      </div>
      <div class="end">
        <MCRouterLink to="/space" class="button">返回</MCRouterLink>
        <MCButton class="button" @click="startExam"> 开始</MCButton>
      </div>
    </div>
  </div>
</template>
<style scoped>
.sub-title {
  text-align: center;
  user-select: none;
  font-size: var(--title-font-size-medium);
  padding: 10px;
}

.examinee-info {
  padding: 10px;
  max-width: 700px;
  display: flex;
  flex-direction: column;
}

.tips {
  text-align: center;
  line-height: 40px;
  font-size: var(--title-font-size-small);
  user-select: none;
}

.no-survey-available {
  font-size: var(--title-font-size-medium);
  text-align: center;
}

.examinee-info .option-list {
  margin: 10px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  height: 200px;
  max-width: 550px;
  /* background-color: aqua; */
}

.examinee-info .option-list :deep(button) {
  min-width: 225px;
  height: 50px;
}

@media screen and (max-width: 750px) {
  .examinee-info {
    padding: 10px;
    margin: 0 0px 10px 0px;
  }
}
</style>
