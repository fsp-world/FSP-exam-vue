<template>
  <div class="exam-list">
    <p class="title">考试列表</p>
    <p class="tips">系统只保留最近10条记录</p>
    <ul class="list y-scroll">
      <li v-for="res in responseList" :key="res.id">
        <div class="info">
          <p>{{ res.type }}试卷（{{ res.isReviewed ? '已通过' : '审核中' }}）</p>
          <p>{{ dateFormat(res.responseTime) }}</p>
        </div>
        <MCButton v-if="res.isReviewed" class="button" @click="handleClick(res)">查看成绩</MCButton>
      </li>
    </ul>
  </div>
  <InfoDialog :show="flag" dialog-type="info-card">
    <p style="margin-top: 20px">
      您的成绩为: <span>{{ response?.score }}</span>
    </p>
    <p style="display: flex; justify-content: center; margin-top: 10px">
      <span>可以进服游玩！</span>
    </p>
    <MCButton
      class="button"
      style="width: 80px; height: 40px; position: absolute; right: 30px; bottom: 10px"
      @click="flag = false"
      >确认</MCButton
    >
  </InfoDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getResponses } from '@/apis/query';
import type { IQueryResponse } from '@/types';
import { dateFormat } from '@/utils/date';
import MCButton from './MCButton.vue';
import InfoDialog from './InfoDialog.vue';

const responseList = ref<IQueryResponse[]>([]);
const response = ref<IQueryResponse>();
const flag = ref(false);

const getResponseList = () => {
  getResponses().then((res) => {
    if (res.data.code === 0) {
      responseList.value = res.data.list;
    }
  });
};
getResponseList();

const handleClick = (res: IQueryResponse) => {
  flag.value = true;
  response.value = res;
};
</script>

<style scoped>
.exam-list {
  width: 100%;
  height: 100%;
}

.title {
  font-size: 30px;
  line-height: 30px;
  padding: 5px;
  text-align: center;
}

.tips {
  font-size: 20px;
  line-height: 20px;
  padding: 5px;
  padding-bottom: 20px;
  text-align: center;
  color: grey;
}

.list {
  width: 80%;
  max-width: 1000px;
  max-height: calc(100vh - 300px);
  margin: 0 auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
}

.list li {
  font-size: 30px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
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
  display: block;
}

.list li:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
@media (max-width: 800px) {
  .list {
    width: 100%;
  }
  .list li {
    flex-wrap: wrap;
  }
  .list li .info {
    width: 100%;
    display: block;
  }
  .list li button {
    width: 100%;
    height: 60px;
    font-size: 28px;
    display: block;
  }
}
</style>
