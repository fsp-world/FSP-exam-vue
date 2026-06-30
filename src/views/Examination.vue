<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import MCButton from '@/components/MCButton.vue';
import QuestionMap from '@/components/QuestionMap.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import QuestionBackground from '@/components/QuestionBackground.vue';
import PaperDone from '@/components/PaperDone.vue';
import InfoDialog from '@/components/InfoDialog.vue';
import { openAlert } from '@/utils/TsAlert';
import { getSurvey, completeSurvey } from '@/apis/survey';
import { useRoute } from 'vue-router';
import type { UserViewQuestion } from '@/types/survey';

const route = useRoute();
const sid = Number(route.params.sid);

const questions = ref<UserViewQuestion[]>([]);
const flag = ref(false);
const isDone = ref(false);
const score = ref(0);
const surveyName = ref('');
const confirm = ref(false);
const timeRemaining = ref('');

const ableToSubmit = ref(false)

let intervalId: ReturnType<typeof setInterval> | null = null; // 定时器 ID
let deadline: Date | null = null;

const formatRemainingTime = (remainingTimeMs: number) => {
  // 将毫秒转换为秒
  let totalSeconds = Math.floor(remainingTimeMs / 1000);

  // 计算小时、分钟和秒
  let hours = Math.floor(totalSeconds / 3600); // 一小时有3600秒
  let minutes = Math.floor((totalSeconds - hours * 3600) / 60); // 剩余秒数除以60得到分钟
  let seconds = totalSeconds - hours * 3600 - minutes * 60; // 最后剩下的秒数

  // 格式化输出，确保两位数显示
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  // 返回格式化后的字符串
  return `${hoursStr}时 ${minutesStr}分 ${secondsStr}秒`;
};

// 更新剩余时间
const updateTimeRemaining = () => {
  if (!deadline) return;
  const remainingTimeMs = deadline.getTime() - new Date().getTime();
  if (remainingTimeMs <= 0) {
    if (intervalId) clearInterval(intervalId);
    timeRemaining.value = '00时 00分 00秒';
    ableToSubmit.value = false
    openAlert('时间已到！未提交自动作废');
  } else {
    timeRemaining.value = formatRemainingTime(remainingTimeMs);
  }
};

const start = () => {
  if (!sid) {
    openAlert('未知试卷');
    return;
  }
  getSurvey(sid).then((res) => {
    const data = res.data
    flag.value = true;
    if (data.code === 1) {
      openAlert(data.desc);
    } else {
      questions.value = data.data.questions
      surveyName.value = data.data.name;
      ableToSubmit.value = true

      deadline = new Date(data.data.ddl);

      // 初始化剩余时间显示
      updateTimeRemaining();

      // 启动定时器来实时更新剩余时间
      intervalId = setInterval(updateTimeRemaining, 1000); // 每秒更新一次
    }
  });
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const checkDone = async () => {
  return new Promise<void>((resolve, reject) => {
    const not: number[] = [];
    questions.value.forEach((item: UserViewQuestion, index: number) => {
      if (!item.answer) {
        not.push(index + 1);
      }
    });
    if (!not.length) resolve();
    else reject(not);
  });
};

const complete = () => {
  confirm.value = false;

  const submitData = {
    surveyId: sid,
    answers: questions.value
  }

  completeSurvey(submitData).then((res) => {
    if (res.data.code === 0) {
      score.value = res.data.data;
      isDone.value = true;
    }
    if (res.data.code === 1) {
      openAlert(res.data.desc);
    }
  });
};

const submitPaper = () => {
  checkDone()
    .then(() => {
      complete();
    })
    .catch((res) => {
      openAlert('有题目未完成请查看左侧题目地图！');
      confirm.value = true;
    });
};
onMounted(() => {
  start();
});
</script>

<template>
  <QuestionBackground :flag="flag">
    <div class="center">
      <div class="exam-title">
        <p class="title">像素仙缘入服测试卷</p>
        <p class="type">{{ surveyName }}</p>
        <p class="time">剩余时间：{{ timeRemaining }}</p>
      </div>
      <ul class="question-list">
        <li class="question" v-for="(question, questionIndex) in questions" :key="questionIndex"
          :id="'question' + (questionIndex + 1)">
          <QuestionCard :index="questionIndex" :mode="'view'" v-model="questions[questionIndex]"></QuestionCard>
        </li>
      </ul>
      <div class="submit">
        <MCButton :disabled="!ableToSubmit" :length="'medium'" class="minecraft-button" @click="submitPaper()">交卷
        </MCButton>
      </div>
      <br />
      <br />
    </div>
  </QuestionBackground>
  <InfoDialog :show="confirm" dialogType="warn-card">
    <p style="margin-top: 20px">还有未完成题目！确认提交？</p>
    <div class="confirm-buttons">
      <MCButton :length="'medium'" class="btn" @click="confirm = false">取消</MCButton>
      <MCButton :length="'medium'" class="btn" @click="complete()">确认</MCButton>
    </div>
  </InfoDialog>
  <PaperDone v-if="isDone" :score="score"></PaperDone>
  <QuestionMap v-else :questions="questions"></QuestionMap>
</template>

<style scoped>
.center {
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  min-height: 100vh;
  background-color: rgba(255, 255, 255, 0.4);
}

.submit {
  height: var(--block-size);
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit button {
  width: 250px;
  height: 50px;
  font-size: var(--button-font-size-medium);
}

.exam-title {
  padding-top: 60px;
  text-align: center;
  user-select: none;
}

.exam-title .title {
  font-weight: bold;
  font-size: 42px;
}

.exam-title .type {
  font-size: 40px;
}

.exam-title .time {
  padding-top: 30px;
  font-size: 30px;
}

.question-list {
  width: calc(100% - 100px);
  padding: 50px;
  --qestion-font-size: 20px;
}

.question {
  padding: 16px 0;
  margin: 10px 0;
  width: 100%;
  position: relative;
}

.confirm-buttons {
  margin: 0 auto;
  padding-top: 5px;
  display: flex;
  justify-content: center;
  gap: 5px;
  max-width: calc(100% - 30px);
}
</style>
