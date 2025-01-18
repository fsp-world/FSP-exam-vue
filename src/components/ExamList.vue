<script setup>
import { examList1 } from "../stores/examList.js";
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

<style scoped></style>