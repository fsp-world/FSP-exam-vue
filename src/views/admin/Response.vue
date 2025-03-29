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
          <tr v-for="item in responsesData.list" :key="item.id">
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
              <MCButton v-if="!item.isReviewed" class="button" @click="reviewed(item.id, true)">通过</MCButton>
              <MCButton v-if="!item.isReviewed" class="button" @click="reviewed(item.id, false)">拒绝</MCButton>
              <MCButton class="button" @click="detail(item.id)">详情</MCButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <button type="button" @click="loadPagination(responsesData.page - 1, responsesData.size)" :disabled="responsesData.page === 1">
        上一页
      </button>
      <span>第 {{ responsesData.page }} 页 / 共 {{ responsesData.totalPages }} 页</span>
      <button
        type="button"
        @click="loadPagination(responsesData.page + 1, responsesData.size)"
        :disabled="responsesData.page * responsesData.size >= responsesData.total"
      >
        下一页
      </button>
      <button
        type="button"
        @click="loadPagination(responsesData.totalPages, responsesData.size)"
        :disabled="responsesData.page === responsesData.totalPages"
      >
        最后一页
      </button>
    </div>

    <ResponseDetail v-if="visibility" v-model:visibility="visibility" :data="detailData"></ResponseDetail>
  </div>
</template>

<script setup lang="ts">
import { getResponses, reviewedResponse, responseDetail } from '@/apis/admin';
import type { IResponse } from '@/types';
import { ref, watch, onMounted } from 'vue';
import moment from 'moment';
import MCButton from '@/components/MCButton.vue';
import ResponseDetail from '@/views/admin/ResponseDetail.vue';

const visibility = ref<boolean>(false);

interface IData {
  list: IResponse[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}
const detailData = ref()
const responsesData = ref<IData>({
  list: [],
  page: 1,
  size: 10,
  total: 0,
  totalPages: 0,
});;
// 分页加载用户数据
const loadPagination = async (page = 1, size = 10) => {
  const res = await getResponses({ page, size });
  if (res.data.code === 0) {
    responsesData.value = res.data;
    responsesData.value.totalPages = Math.ceil(res.data.total / res.data.size);
  }
};

const reviewed = (id: number, pass: boolean) => {
  const text: string = pass ? '确定通过吗？' : '确定拒绝吗？';
  const userConfirmed = confirm(text);
  if (userConfirmed && pass) {
    (reviewedResponse as (data: { response: number }) => Promise<any>)({ response: id }).then(() => {
      // loadPagination(data.value.page, data.value.size);
    });
  } else if (userConfirmed && !pass) {
  }
};

const detail = (id: number) => {
  (responseDetail as (id: number) => Promise<any>)(id).then((res: { data: any }) => {
    detailData.value = res.data;
    visibility.value = true;
    // pagination.value = {
    //   page: responsesData.value.page,
    //   size: responsesData.value.size,
    // };
  });
};

watch(visibility, (newValue) => {
  if (newValue == false) {
    // console.log(data.value.page);
    // console.log(data.value.size);
    // loadPagination(data.value.page, data.value.size);
  }
});
// 初始化加载数据
onMounted(() => {
  loadPagination();
});
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
  min-width: 200px;
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
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  button {
    margin: 5px;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    background-color: #ccc;
    cursor: pointer;
  }
  button:hover {
    background-color: #888;
  }
  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
}
</style>
