<script setup>
import { getResponses } from '@/apis/admin'
import { ref } from 'vue';

const data = ref({})

getResponses().then(res => {
    data.value = res.data
})
</script>

<template>
    <p>问卷管理</p>
    <p>{{ data }}</p>
</template>