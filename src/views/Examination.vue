<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import MCButton from '@/components/MCButton.vue';
import QuestionMap from '@/components/QuestionMap.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import QuestionBackground from '@/components/QuestionBackground.vue';
import PaperDone from '@/components/PaperDone.vue';
import InfoDialog from '@/components/InfoDialog.vue';
import { openAlert } from '@/utils/TsAlert';
import { getSurvey, submitSurveyAPI } from '@/apis/survey';
import { useRoute } from 'vue-router';
import { AnsweredQuestion, QuestionType, type AnswerSurvey, type AnsweredSurvey } from '@/types/survey';
import { formatRemainingTimeToHHmmss } from '@/utils/date';

const route = useRoute();
const sid = Number(route.params.sid);

const answerSurvey = ref<AnswerSurvey | null>(null)

const renderBackground = ref(false); // 当题目加载完成后再渲染背景
const isDone = ref(false);
const objectiveScore = ref(0);
const confirmSubmit = ref(false);
const timeRemaining = ref('');

const ableToSubmit = ref(false)

let intervalId: ReturnType<typeof setInterval> | null = null; // 定时器 ID
let deadline: Date | null = null;


const updateTimeRemaining = () => {
  if (!deadline) return;
  const remainingTimeMs = deadline.getTime() - new Date().getTime();
  if (remainingTimeMs <= 0) {
    if (intervalId) clearInterval(intervalId);
    timeRemaining.value = '00时 00分 00秒';
    ableToSubmit.value = false
    openAlert('时间已到！未提交自动作废');
  } else {
    timeRemaining.value = formatRemainingTimeToHHmmss(remainingTimeMs);
  }
};


getSurvey(sid).then((res) => {
  const data = res.data

  if (data.code !== 0) {
    openAlert(data.desc);
    return
  }

  answerSurvey.value = data.data
  renderBackground.value = true;
  ableToSubmit.value = true

  deadline = new Date(data.data.ddl);
  updateTimeRemaining();
  intervalId = setInterval(updateTimeRemaining, 1000); // 每秒更新1次
});


// 组件卸载时清除定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// 检查题目是否答完
const checkDone = async () => {
  return new Promise<void>((resolve, reject) => {
    const questions = answerSurvey.value!.questions;
    const notAnsweredQuestions: number[] = [];
    questions.forEach((item, index) => {
      // 选择题：检查是否有选项被选中；填空/主观题：检查 answer 是否有内容
      // !! — 双重取反，把值转成布尔值：有内容 → true，空字符串/undefined → false
      const isChoice = item.type === QuestionType.SingleChoice || item.type === QuestionType.MultipleChoice;
      const hasAnswer = isChoice
        ? item.options.some(opt => (opt as any).isSelected)
        : !!(item as any).answer?.[0];
      if (!hasAnswer) {
        notAnsweredQuestions.push(index + 1);
      }
    });
    if (!notAnsweredQuestions.length) resolve();
    else reject(notAnsweredQuestions);
  });
};

//真交卷
const complete = () => {
  confirmSubmit.value = false;

  const submitData: AnsweredSurvey = {
    surveyId: sid,
    answers: answerSurvey.value!.questions.map(q => ({
      id: q.id,
      answer:
        q.type === QuestionType.SingleChoice || q.type === QuestionType.MultipleChoice
          ? q.options.filter(opt => (opt as any).isSelected).map(opt => opt.id)
          : (q as any).answer ?? []
    })),
  }

  submitSurveyAPI(submitData).then((res) => {
    if (res.data.code === 0) {
      objectiveScore.value = res.data.data;
      isDone.value = true;
    }
    if (res.data.code === 1) {
      openAlert(res.data.desc);
    }
  });
};

// 点击交卷按钮
const submitPaper = () => {
  checkDone()
    .then(() => {
      // 如果题目都做了直接提交
      complete();
    })
    .catch((res) => {
      // 如果有没做的题目，弹窗提醒一下
      openAlert('有题目未完成请查看左侧题目地图！');
      confirmSubmit.value = true;
    });
};


</script>

<template>
  <QuestionBackground :flag="renderBackground">
    <div class="center">
      <div class="exam-title">
        <p class="title">像素仙缘入服测试卷</p>
        <p class="name">{{ answerSurvey?.name }}</p>
        <p class="time">剩余时间：{{ timeRemaining }}</p>
      </div>
      <ul class="question-list">
        <li class="question" v-for="(question, questionIndex) in answerSurvey!.questions" :key="questionIndex"
          :id="'question' + (questionIndex + 1)">
          <QuestionCard :index="questionIndex" :mode="'answer'" v-model="answerSurvey!.questions[questionIndex]">
          </QuestionCard>
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
  <InfoDialog :show="confirmSubmit" dialogType="warn-card">
    <p style="margin-top: 20px">还有未完成题目！确认提交？</p>
    <div class="confirm-buttons">
      <MCButton :length="'medium'" class="btn" @click="confirmSubmit = false">取消</MCButton>
      <MCButton :length="'medium'" class="btn" @click="complete()">确认</MCButton>
    </div>
  </InfoDialog>
  <PaperDone v-if="isDone" :score="objectiveScore"></PaperDone>
  <QuestionMap v-else :questions="answerSurvey!.questions as unknown as AnsweredQuestion[]"></QuestionMap>
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

.exam-title .name {
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
