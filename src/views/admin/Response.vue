<template>
  <h1>答卷审核</h1>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>完成</th>
        <th>审核</th>
        <th>试卷</th>
        <th>试卷ID</th>
        <th>用户</th>
        <th>创建日期</th>
        <th>完成日期</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in responses" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.isCompleted ? '已完成' : '未完成' }}</td>
        <td>{{ item.isReviewed ? '已通过' : '未通过' }}</td>
        <td>{{ item.survey }}</td>
        <td>{{ item.surveyId }}</td>
        <td>{{ item.username }}</td>
        <td>{{ moment(item.createTime).format('YY年MM月DD日 HH时') }}</td>
        <td>{{ moment(item.responseTime).format('YY年MM月DD日 HH时') }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { getResponses } from '@/apis/admin';
import type { IResponse } from '@/types';
import { ref } from 'vue';
import moment from 'moment';

const responses = ref<IResponse[]>();

getResponses().then((res: { data: { list: IResponse[]; code: number } }) => {
  if (res.data.code === 0) {
    responses.value = res.data.list;
  }
});
</script>

<style scoped>
table,
table td,
table th {
  border: 1px solid #000000;
}
table {
  width: 100%;
}
td,
th {
  padding: 5px;
  text-align: center;
}
</style>

