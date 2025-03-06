<script setup>
import { getSurvey } from '@/apis/admin';
import QuestionCard from '@/components/QuestionCard.vue';
import AddQuestion from '@/views/admin/AddQuestion.vue';
import { onMounted, ref } from 'vue';

const { sid } = defineProps({
  sid: Number,
});

const survey = ref({
  name: '加载中...',
  description: '加载中...',
  questions: [],
});

onMounted(() => {
  _getSurvey();
});

const _getSurvey = () => {
  getSurvey(sid).then((res) => {
    survey.value = res.data;
    survey.value.sumScore = 0;
    for (let i in survey.value.questions) {
      survey.value.sumScore += survey.value.questions[i].score;
    }
  });
};
</script>

<template>
  <div class="edit-exam">
    <div>
      <div class="survey-info">
        <div class="close" @click="$emit('close', 0)"><span>&times;</span></div>
        <h1 class="title">{{ survey.name }}</h1>
        <p class="desc">试卷描述：{{ survey.description }}</p>
        <p class="time">创建时间：{{ survey.create_time }}</p>
      </div>
      <hr />
      <details>
        <summary>点击添加题目</summary>
        <AddQuestion
          :sid="sid"
          @on-add="
            (payload) => {
              _getSurvey();
            }
          "
        ></AddQuestion>
      </details>
      <hr />
    </div>
    <div class="view-survey">
      <p class="sum-score">试卷总分：{{ survey.sumScore }} 分</p>
      <ul class="question-list">
        <li
          class="question"
          v-for="(question, questionIndex) in survey.questions"
          :key="questionIndex"
          :id="'question' + (questionIndex + 1)"
        >
          <QuestionCard
            :lock="true"
            :question="question"
            :index="questionIndex"
          ></QuestionCard>
        </li>
        <li class="question-list-none" v-if="!survey.questions.length">
          暂未添加题目
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.edit-exam {
  max-width: 1000px;
  width: 90%;
  height: 85%;
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #eee;
  border-radius: 8px;
  summary {
    user-select: none;
  }
}

.edit-exam .survey-info {
  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 25px;
    background-color: white;
    border-radius: 50%;
    box-sizing: border-box;
  }
  .close span {
    margin: 2px 0px 0px 2px;
  }
  .close:hover {
    background-color: rgb(139, 139, 139);
  }
}

.edit-exam .view-survey {
  flex-grow: 1;
  overflow: scroll;
  .sum-score {
    font-size: 20px;
    text-align: center;
    user-select: none;
  }
  .question-list {
    position: relative;
  }
  .question-list-none {
    text-align: center;
    padding-top: 10px;
    font-size: 30px;
  }
}
</style>
