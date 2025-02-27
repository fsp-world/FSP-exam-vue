<script setup>
import { getUserInfo } from '@/apis/user.js';
import { ref, computed } from 'vue';
import MCRouterLink from '@/components/MCRouterLink.vue';

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
    <div class="translucent-bg"></div>
    <div class="translucent-content">
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
        <div class="menu">
          <MCRouterLink class="button" to="/Query/Guarantee"> 担保查询 </MCRouterLink>
          <MCRouterLink class="button" to="/Query/Examination"> 考试查询 </MCRouterLink>
        </div>
      </div>
      <div class="end">
        <MCRouterLink to="/" class="button">返回</MCRouterLink>
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

.main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.user-info {
  width: calc(100% - 40px);
  max-width: 440px;
  height: 120px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);
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
}

.menu {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .button {
    width: 100%;
    height: 50px;
    background-color: #4fc08d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 20px;
  }

  .button:hover {
    background-color: #42b883;
  }
}
</style>
