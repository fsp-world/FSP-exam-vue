<script setup>
import { getProfilePic } from '@/apis/mj.js';
import { getUserInfo, getUserWhitelist } from '@/apis/user.js';
import { ref, computed } from 'vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import MCButton from '@/components/MCButton.vue';

const user = ref({
  id: 0,
  username: '',
  user_qq: '',
  role: '',
  addtime: '',
  avatar: '',
  status: 0,
});

const userWhiteList = ref([]);

getUserInfo().then((res) => {
  user.value = res.data.data;
});

getUserWhitelist().then((res) => {
  if (res.data.code === 0) {
    userWhiteList.value = res.data.list;
    for (let player of userWhiteList.value) {
      getProfilePic(player.name).then((avatar) => {
        if (avatar.msg === 'ok') {
          player.avatarUrl = avatar.imgUrl;
        }
      });
    }
  }
});

const getStatus = computed(() => {
  return user.value.status == 0 ? '未激活' : user.value.status == 1 ? '正常' : '封禁';
});

const dateToLocal = computed(() => {
    const date = new Date(user.value.addtime);
    return `${date.getFullYear()}年 ${date.getMonth() + 1} 月 ${date.getDate()} 日 ${date.getHours()}时`;
})
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
            <p>注册日期: {{ dateToLocal }}</p>
            <p>账号状态: {{ getStatus }}</p>
          </div>
        </div>
        <div class="white-list">
          <p class="title">授权的游戏账户</p>
          <ul>
            <li class="player" v-for="(item, index) in userWhiteList" v-bind:key="index">
              <img class="avatar" :src="item.avatarUrl" alt="User Avatar" />
              <p class="name">{{ item.name }}</p>
              <MCButton class="button">设置为头像</MCButton>
            </li>
          </ul>
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
    border-radius: 10px;
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

.white-list {
  width: calc(100% - 40px);
  max-width: 440px;
  min-height: 70px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);
  .title {
    text-align: center;
    font-size: 20px;
    padding-bottom: 10px;
  }
  .player {
    display: flex;
    justify-content: space-between;
    --hei: 50px;
    padding: 5px 0;
    .avatar {
      image-rendering: pixelated;
      border-radius: 5px;
      height: var(--hei);
      border: 3px solid #000;
    }
    .name {
      width: 100%;
      font-size: 20px;
      line-height: var(--hei);
      padding: 0 10px;
      text-align: left;
    }
    .button {
      width: 200px;
      font-size: 16px;
    }
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
