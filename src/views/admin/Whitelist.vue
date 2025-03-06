<script setup>
import { onMounted, ref } from 'vue';
import { getWhitelist } from '@/apis/admin';

const wlData = ref({});

getWhitelist().then((res) => {
  console.log(res.data);
  wlData.value = res.data;
});
</script>

<template>
  <h1>白名单管理</h1>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>用户ID</th>
        <th>MC NAME</th>
        <th>UUID</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of wlData.list" :key="index">
        <td>{{ item.id }}</td>
        <td>{{ item.uid }}</td>
        <td>{{ item.name }}</td>
        <td class="uuid">{{ item.uuid }}</td>
      </tr>
    </tbody>
  </table>
</template>

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
