<template>
  <div class="preview">
    <span class="close-btn" @click="emit('update:visibility', false)">&times;</span>
    <ul>
      <li
        class="question"
        v-for="(question, questionIndex) in props.data.questions"
        :key="question.id"
        :id="'question' + (questionIndex + 1)"
      >
        <QuestionCard
          :lock="true"
          v-model="props.data.questions[questionIndex]"
          :index="questionIndex"
          @scoreChange="handleScoreChange"
        ></QuestionCard>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard.vue';
import { detailScore } from '@/apis/admin';
import { useAlertStore } from '@/stores/alert';
import type { IalertData } from '@/types';

const alertStore = useAlertStore();
const openAlert = (message: string) => {
  const data: IalertData = {
    title: 'login' + Date(),
    type: 'info-card',
    message: message,
    age: 3000,
    flag: true,
  };
  alertStore.openAlert(data);
};

const props = defineProps(['data', 'visibility']);
const emit = defineEmits(['update:visibility']);

const handleScoreChange = (payload: { questionId: number; score: number }) => {
  (detailScore as (data: { score: number; questionId: number; responseId: number }) => Promise<any>)({
    ...payload,
    responseId: props.data.id,
  })
    .then((res: { data: { code: number; desc: string } }) => {
      openAlert(res.data.desc);
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

<style scoped>
.preview {
  position: fixed;
  top: 20px;
  right: 0;
  left: 50%;
  transform: translate(-50%);
  width: 60vw;
  background-color: white;
  box-shadow: 3px 6px 10px 6px #ccc;
  padding: 20px;

  .close-btn {
    position: absolute;
    display: block;
    padding: 4px 4px;
    top: 10px;
    right: 10px;
    background-color: aqua;
    font-size: 30px;
    z-index: 20;
  }
}
</style>
