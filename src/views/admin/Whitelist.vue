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
  <p>白名单管理</p>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>用户</th>
        <th>name</th>
        <th>uuid</th>
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
p,
table {
  text-align: center;
}

td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.uuid {
  max-width: 260px;
}
</style>
