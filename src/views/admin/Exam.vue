<script setup>
import { getResponses, getQuestion } from '@/apis/admin'
import { ref } from 'vue';

const questionData = ref({
    code: -1,
    list: [],
    desc: ''
})
const responsesData = ref({
    code: -1,
    list: [],
    desc: ''
})

getQuestion().then(res => {
    questionData.value = res.data
})
getResponses().then(res => {
    responsesData.value = res.data
})


</script>

<template>
    <h2>问卷管理</h2>
    <p><button @click="">新建问卷</button></p>
    <div>
        <p v-if="!questionData.list.length">暂无数据</p>
    </div>
    <h2>答卷管理</h2>
    <div>
        <p v-if="!responsesData.list.length">暂无数据</p>
    </div>
</template>