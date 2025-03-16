<script setup>
import { ref } from 'vue';
import MCButton from '@/components/MCButton.vue';
import QuestionMap from '@/components/QuestionMap.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import QuestionBackground from '@/components/QuestionBackground.vue';
import { useAlertStore } from '@/stores/alert';
import { getSurvey, submitResponseDetail } from '@/apis/default.js';
import { useRoute } from 'vue-router';

const route = useRoute();

const alertStore = useAlertStore();
const openAlert = (message) => {
  const data = {
    title: 'exam' + Date(),
    type: 'info-card',
    message: message,
    age: 3000,
    flag: true,
  };
  alertStore.openAlert(data);
};

const questions = ref([]);
const remainingTime = ref('');
const flag = ref(false);
const type = ref('');

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

const submitPaper = () => {
  console.log(questions);
};

const handleChange = (payload) => {
  console.log(payload.value);
  submitResponseDetail(payload.value).then((res) => {
    console.log(res);
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
          <QuestionCard
            v-model="questions[questionIndex]"
            :index="questionIndex"
            @option-change="handleChange"
          ></QuestionCard>
        </li>
      </ul>
      <div class="submit">
        <MCButton class="minecraft-button" @click="submitPaper()">交卷</MCButton>
      </div>
      <br />
      <br />
    </div>
  </QuestionBackground>
  <QuestionMap :questions="questions"></QuestionMap>
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
  font-size: 50px;
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
</style>
