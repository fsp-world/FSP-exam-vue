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
        <th>操作</th>
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
        <td><MCButton @click="reviewed(item.id)">通过</MCButton></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { getResponses, reviewedResponse } from '@/apis/admin';
import type { IResponse } from '@/types';
import { ref } from 'vue';
import moment from 'moment';
import MCButton from '@/components/MCButton.vue';

const responses = ref<IResponse[]>();

getResponses().then((res: { data: { list: IResponse[]; code: number } }) => {
  if (res.data.code === 0) {
    responses.value = res.data.list;
  }
});

const reviewed = (id: number) => {
  (reviewedResponse as (data: {response: number}) => Promise<any>)({response: id}).then((res) => {
    console.log(res.data);
  });
};
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
