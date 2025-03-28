<template>
  <div class="box">
    <h1>答卷审核</h1>
    <div class="table-box">
      <table>
        <thead>
          <tr>
            <th class="id">#</th>
            <th class="is-done">完成</th>
            <th class="status">审核状态</th>
            <th class="survey-name">试卷</th>
            <th class="survey-id">试卷ID</th>
            <th class="score">分数</th>
            <th class="user">用户</th>
            <th class="player-name">MCname</th>
            <th class="add-time">创建日期</th>
            <th class="done-time">完成日期</th>
            <th class="action">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in responses" :key="item.id">
            <td>{{ item.id }}</td>
            <td :style="item.isCompleted ? { color: 'green' } : { color: 'red' }">
              {{ item.isCompleted ? '已完成' : '未完成' }}
            </td>
            <td :style="item.isReviewed ? { color: 'green' } : { color: 'red' }">
              {{ item.isReviewed ? '已通过' : '未通过' }}
            </td>
            <td>{{ item.survey }}</td>
            <td>{{ item.surveyId }}</td>
            <td>{{ item.score }}</td>
            <td>{{ item.username }}</td>
            <td>{{ item.playername }}</td>
            <td>{{ moment(item.createTime).format('YY年MM月DD日 HH时') }}</td>
            <td>{{ moment(item.responseTime).format('YY年MM月DD日 HH时') }}</td>
            <td class="action">
              <MCButton v-if="!item.isReviewed" class="button" @click="reviewed(item.id)">通过</MCButton>
              <MCButton class="button" @click="detail(item.id)">详情</MCButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ResponseDetail v-if="visibility" v-model:visibility="visibility" :data="data"></ResponseDetail>
  </div>
</template>

<script setup lang="ts">
import { getResponses, reviewedResponse, responseDetail } from '@/apis/admin';
import type { IResponse } from '@/types';
import { ref } from 'vue';
import moment from 'moment';
import MCButton from '@/components/MCButton.vue';
import ResponseDetail from '@/views/admin/ResponseDetail.vue';

const responses = ref<IResponse[]>();
const visibility = ref<boolean>(false);
const data = ref();

const getRes = () => {
  getResponses().then((res: { data: { list: IResponse[]; code: number } }) => {
    if (res.data.code === 0) {
      responses.value = res.data.list;
    }
  });
};
getRes();

const reviewed = (id: number) => {
  (reviewedResponse as (data: { response: number }) => Promise<any>)({ response: id }).then((res: { data: any }) => {
    getRes();
  });
};

const detail = (id: number) => {
  (responseDetail as (id: number) => Promise<any>)(id).then((res: { data: any }) => {
    data.value = res.data;
    visibility.value = true;
  });
};
</script>

<style scoped>
.box {
  height: 100%;
  overflow-y: auto;
}
.table-box {
  max-width: 1600px;
  overflow-x: auto;
}
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
.is-done,
.status,
.survey-name,
.survey-id,
.score,
.user,
.player-name {
  min-width: 75px;
}

.add-time,
.done-time {
  min-width: 150px;
}
.action {
  min-width: 120px;
  display: flex;
  justify-content: center;
  gap: 6px;
  .button {
    font-size: 20px;
    padding: 5px;
    width: 100%;
  }
}
@media (max-width: 1200px) {
  .table {
    max-width: 90vw;
  }
}
</style>
