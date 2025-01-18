<script setup>
import { ref } from 'vue'
import axios from "axios"
import QuestionMap from "../components/QuestionMap.vue";
import QuestionCard from "../components/QuestionCard.vue";
import QuestionBackground from "../components/QuestionBackground.vue";
// import { testQuestions1 } from "../stores/questionList.js";

const questions = ref({})
const flag = ref(false)
axios.get('http://localhost:5000/default/survey/1')
    .then(res => {
        flag.value = true
        questions.value = res.data.questions
    })
</script>

<template>
    <QuestionBackground :flag="flag">
        <div class="center">
            <div class="exam-title">
                <p class="title">像素仙缘入服测试卷</p>
                <p class="type">{{}}类试题</p>
                <p class="time">{{ remainingTime }}</p>
            </div>
            <ul class="question-list">
                <li class="question" v-for="(question, questionIndex) in questions" :key="questionIndex"
                    :id="'question' + (questionIndex + 1)">
                    <QuestionCard :question="question" :index="questionIndex"></QuestionCard>
                </li>
            </ul>
            <div class="submit">
                <button class="minecraft-button" type="button" @click="submitTestPaper()">
                    交卷
                </button>
            </div>
            <br>
            <br>
        </div>
    </QuestionBackground>
    <QuestionMap :questions="questions"></QuestionMap>
</template>

<style scoped>
.examination-page {
    /* position: relative;
    z-index: 99; */
    font-family: "mc-font";
    width: 100%;
    --block-size: 130px;
}

.center {
    margin-left: auto;
    margin-right: auto;
    max-width: 1000px;
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

/* .exam-title  */
</style>