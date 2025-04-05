<template>
  <div class="preview">
    <div class="close-btn" @click="emit('update:visibility', false)">&times;</div>
    <div class="paper">
      <h1>阅卷说明</h1>
      <div class="readme">
        <ul>
          <li>阅卷过程中请保持客观公正</li>
          <li>带有黑框的选项是用户选择的选项，带有绿色圆点的是正确选项</li>
          <li>客观题已自动批分，请为主观题批分，所有题目的得分都可以通过下拉框修改</li>
          <li>改完分数点击右上角的X退出即可，然后在管理页面选择是否通过</li>
        </ul>
      </div>
      <h1>答题卡</h1>
      <ul>
        <li
          class="question"
          v-for="(question, questionIndex) in props.data.questions"
          :key="question.id"
          :id="'question' + (questionIndex + 1)"
        >
          <QuestionCard
            :mode="'review'"
            v-model="props.data.questions[questionIndex]"
            :index="questionIndex"
            @scoreChange="handleScoreChange"
          ></QuestionCard>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionCard from '@/components/QuestionCard.vue';
import { detailScore } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';

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
.close-btn {
  --hei: 30px;
  display: block;
  width: var(--hei);
  height: var(--hei);
  padding: 4px 4px;
  text-align: center;
  line-height: var(--hei);
  font-size: var(--hei);
  position: absolute;
  top: 10px;
  right: 50px;
  background-color: aqua;
  z-index: 20;
  border-radius: 50%;
}
.preview {
  position: fixed;
  top: 20px;
  right: 0;
  left: 50%;
  transform: translate(-50%);
  width: 70vw;
  height: 92%;
  padding: 20px;
  background-color: white;
  box-shadow: 3px 6px 10px 6px #ccc;
  .paper {
    width: 70vw;
    height: 92%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  h1 {
    font-size: 30px;
  }
  .readme {
    ul {
      padding: 10px 20px;
      li {
        display: list-item;
        list-style-type: circle;
        line-height: 1.5em;
      }
    }
  }
}

@media (max-width: 1200px) {
  .preview {
    width: calc(100vw - 60px);
    height: 95%;
    top: 0px;
    left: 20px;
    transform: none;
    box-shadow: none;
  }
}
</style>
