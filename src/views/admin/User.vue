<script setup>
import { getUsers } from '@/apis/admin';
import { ref } from 'vue';

const data = ref({});

getUsers().then((res) => {
  data.value = res.data;
});
</script>

<template>
  <h1>用户管理</h1>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>头像</th>
        <th>用户名</th>
        <th>用户 QQ</th>
        <th>用户角色</th>
        <th>注册时间</th>
        <th>账号状态</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in data.list" :key="item.id">
        <td>{{ item.id }}</td>
        <td><img :src="item.avatar" alt="" /></td>
        <td>{{ item.username }}</td>
        <td>{{ item.userQQ }}</td>
        <td>{{ item.role }}</td>
        <td>{{ item.addtime }}</td>
        <td>{{ item.status }}</td>
        <td>
          <button type="button">修改</button>
          <button type="button">封禁</button>
        </td>
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
button {
  margin: 5px auto;
  font-size: 16px;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  background-color: #ccc;
}
button:hover {
  background-color: #888;
}
</style>
