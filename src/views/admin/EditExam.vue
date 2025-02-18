<script setup>
import { getSurvey, addQuestion } from '@/apis/admin'
import QuestionCard from '@/components/QuestionCard.vue';
import { onMounted, ref } from 'vue';

const { sid } = defineProps({
    sid: Number
})

const survey = ref({
    questions: []
})

const formData = ref({
    survey: sid,
    title: '',
    score: 0,
    type: '',
    options: []
})

onMounted(() => {
    getSurvey(sid)
        .then(res => {
            survey.value = res.data
        })
})

const addQuest = () => {
    addQuestion({

    }).then(res => {

    })
}
</script>

<template>
    <div class="editExam">
        <div class="close" @click="$emit('close', 0)"><span>&times;</span></div>
        <h2>{{ survey.name }}</h2>
        <p>{{ survey.description }}</p>
        <hr>
        <form>
            <p><label for="oname">问题</label><textarea id="oname" type="text" v-model="formData.title"></textarea></p>
        </form>
        <hr>
        <ul class="question-list">
            <li class="question" v-for="(question, questionIndex) in survey.questions" :key="questionIndex"
                :id="'question' + (questionIndex + 1)">
                <QuestionCard :question="question" :index="questionIndex"></QuestionCard>
            </li>
            <li v-if="!survey.questions.length">暂未添加题目</li>
        </ul>
    </div>
</template>

<style scoped>
.editExam {
    width: 70%;
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translate(-50%);
    padding: 16px;
    background-color: #ffffffbd;
    border-radius: 8px;
}

.editExam .close {
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
.editExam .close span {
    margin: 2px 0px 0px 2px;
}
.editExam .close:hover {
    background-color: rgb(139, 139, 139);
}

</style>