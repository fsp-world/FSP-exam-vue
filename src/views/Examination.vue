<script setup>
import { ref } from 'vue';
import MCButton from '@/components/MCButton.vue';
import QuestionMap from '@/components/QuestionMap.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import QuestionBackground from '@/components/QuestionBackground.vue';
import PaperDone from '@/components/PaperDone.vue';
import InfoDialog from '@/components/InfoDialog.vue';
import { openAlert } from '@/utils/TsAlert';
import { getSurvey, completeSurvey } from '@/apis/survey.js';
import { useRoute } from 'vue-router';

const route = useRoute();

const questions = ref([]);
const remainingTime = ref('');
const flag = ref(false);
const isDone = ref(false);
const score = ref(0);
const type = ref('');
const confirm = ref(false);

const start = () => {
  if (!route.params.sid) {
    openAlert('未知试卷');
    return;
  }
  getSurvey(route.params.sid).then((res) => {
    flag.value = true;
    if (res.data['code'] === 1) {
      openAlert(res.data['desc']);
    } else {
      questions.value = res.data.questions;
      type.value = res.data.type;
    }
  });
};
start();

const checkDone = async () => {
  return new Promise((resolve, reject) => {
    const not = [];
    // 找未作答题目
    questions.value.forEach((item, index) => {
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
  completeSurvey(questions.value).then((res) => {
    if (res.data.code === 0) {
      score.value = res.data.score;
      isDone.value = true;
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
</script>

<template>
  <QuestionBackground :flag="flag">
    <div class="center">
      <div class="exam-title">
        <p class="title">像素仙缘入服测试卷</p>
        <p class="type">{{ type }}类试题</p>
        <p class="time">{{ remainingTime }}</p>
      </div>
      <ul class="question-list">
        <li
          class="question"
          v-for="(question, questionIndex) in questions"
          :key="questionIndex"
          :id="'question' + (questionIndex + 1)"
        >
          <QuestionCard :mode="'view'" v-model="questions[questionIndex]" :index="questionIndex"></QuestionCard>
        </li>
      </ul>
      <div class="submit">
        <MCButton class="minecraft-button" @click="submitPaper()">交卷</MCButton>
      </div>
      <br />
      <br />
    </div>
  </QuestionBackground>
  <InfoDialog :show="confirm" dialogType="warn-card">
    <p style="margin-top: 20px">还有未完成题目！确认提交？</p>
    <p style="display: flex; justify-content: flex-end; padding-right: 30px; margin-top: 10px">
      <MCButton class="btn" @click="confirm = false">取消</MCButton>
      <MCButton class="btn" @click="complete()">确认</MCButton>
    </p>
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
  width: 400px;
  height: 70px;
  font-size: 28px;
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

.btn {
  border-radius: 5px;
  padding: 12px 20px;
  margin: 0px 10px;
}
</style>
