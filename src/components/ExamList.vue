<script setup>
import { ref } from 'vue';
import { examList1 } from "@/stores/examList.js";
const examList = ref(examList1);
</script>

<template>
    <div class="exam-list">
        <p class="title">考试列表</p>
        <p class="tips">系统只保留最近10条记录</p>
        <ul class="list y-scroll">
            <li v-for="exam in examList" :key="exam.id">
                <div>
                    <p>
                        {{ exam.type }}试卷（{{ exam.status }}）
                    </p>
                    <p>{{ exam.time }}</p>
                </div>
                <slot></slot>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.view-result .exam-list {
    width: 100%;
}

.title {
    font-size: 30px;
    padding: 5px;
    text-align: center;
}

.tips {
    font-size: 20px;
    padding: 5px;
    padding-bottom: 20px;
    text-align: center;
    color: grey;
}

.list {
    width: 80%;
    max-width: 1000px;
    margin: 0 auto;
    max-height: 600px;
    overflow-y: auto;
}

.list li {
    font-size: 30px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
}

.list li p {
    font-size: 25px;
    color: grey;
}

.list li p:first-child {
    font-size: 30px;
    color: #ffffff;
}

.list li button {
    width: 200px;
    font-size: 28px;
    display: none;
}

.list li:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.list li:hover>button {
    display: block;
}
</style>