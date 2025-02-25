<script setup>
import { RouterLink } from 'vue-router';
import { getUserInfo } from '@/apis/user.js';
import { ref, computed } from 'vue';

const user = ref({
  id: 0,
  username: '',
  user_qq: '',
  role: '',
  addtime: '',
  avatar: '',
  status: 0,
});

getUserInfo().then((res) => {
  user.value = res.data.data;
});

const getStatus = computed(() => {
  return user.value.status == 0 ? '未激活' : user.value.status == 1 ? '正常' : '封禁';
});
</script>

<template>
  <div class="view-result">
    <div class="bg"></div>
    <div class="content">
      <div class="title">
        <p>个人空间</p>
      </div>
      <div class="main">
        <div class="user-info">
          <div class="avatar">
            <img :src="user.avatar" alt="User Avatar" />
          </div>
          <div class="user-details">
            <h2>{{ user.username }}</h2>
            <p>用户QQ: {{ user.user_qq }}</p>
            <p>角色: {{ user.role }}</p>
            <p>注册日期: {{ user.addtime }}</p>
            <p>账号状态: {{ getStatus }}</p>
          </div>
        </div>
      </div>
      <div class="end">
        <button type="button" class="minecraft-button button">
          <RouterLink to="/">返回</RouterLink>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.space-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin: 20px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
}

.avatar {
  margin-right: 20px;
  border-radius: 50%;
  overflow: hidden;
  image-rendering: pixelated;
}

.avatar img {
  width: 100px;
  height: auto;
}

.user-details h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

form {
  max-width: 600px;
  margin: 0 auto;
}

button {
  background-color: #4fc08d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #42b883;
}
</style>
