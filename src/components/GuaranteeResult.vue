<script setup>
import { ref } from 'vue';
import { guaranteeQuery } from '@/apis/guarantee';

const applicantData = ref({});
const guaranteeData = ref({});

guaranteeQuery().then((res) => {
  applicantData.value = res.data.data.applicant;
  guaranteeData.value = res.data.data.guarantee;
});
</script>

<template>
  <div class="guarantee-result">
    <table>
      <caption>
        申请列表
      </caption>
      <thead>
        <tr>
          <th>申请担保的 MC 账户</th>
          <th>创建时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of applicantData" :key="item.id">
          <td>{{ item.playerName }}</td>
          <td>{{ item.createTime }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
    <table>
      <caption>
        待确认列表
      </caption>
      <thead>
        <tr>
          <th>请求担保的 MC 账户</th>
          <th>创建时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="guaranteeData.length === 0">
          <td>暂无数据</td>
        </tr>
        <tr v-for="item of guaranteeData" :key="item.id">
          <td>{{ item.playerName }}</td>
          <td>{{ item.createTime }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.guarantee-result {
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.guarantee-result table {
  border-collapse: collapse;
  max-width: 2000px;
  margin: 0 auto;
  margin-top: 50px;
}

.guarantee-result caption {
  font-size: 30px;
}

.guarantee-result .avatar img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.guarantee-result th,
.guarantee-result td {
  padding: 10px 18px;
}

.guarantee-result tr {
  border-bottom: 1px solid #ccc;
}
</style>
