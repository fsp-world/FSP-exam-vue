<script setup>
import { getProfilePic } from '@/apis/mj';
import { getUserWhitelist } from '@/apis/user.js';
import { ref } from 'vue';
import { openAlert } from '@/utils/TsAlert';
import { useUserStore } from '@/stores/user';
import MCRouterLink from '@/components/MCRouterLink.vue';
import MCButton from '@/components/MCButton.vue';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { avatar, username, userQQ, role, avatarUUID, getStatus, dateToLocal, isAdmin } = storeToRefs(userStore);

userStore.syncUserInfo();

const userWhiteList = ref([]);

getUserWhitelist().then((res) => {
  if (res.data.code === 0) {
    userWhiteList.value = res.data.list;
    const avatarPromises = userWhiteList.value.map((player) =>
      getProfilePic(player.name)
        .then((avatar) => {
          if (avatar.msg === 'ok') {
            player.avatarUrl = avatar.imgUrl;
          }
        })
        .catch((err) => {
          console.warn(`Failed to fetch avatar for ${player.name}:`, err);
        }),
    );
    return Promise.all(avatarPromises);
  }
});

const editAvatar = (uuid) => {
  userStore.setAvatar(uuid).then((res) => {
    if (res.data.code === 0) {
      openAlert('头像修改成功');
    } else {
      openAlert('头像修改失败！');
    }
  });
};
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
            <img :src="avatar" alt="User Avatar" />
          </div>
          <div class="user-details">
            <h2>{{ username }}</h2>
            <p>用户QQ: {{ userQQ }}</p>
            <p>角色: {{ role }}</p>
            <p>注册日期: {{ dateToLocal }}</p>
            <p>账号状态: {{ getStatus }}</p>
          </div>
        </div>
        <div class="white-list y-scroll">
          <p class="title">授权的游戏账户</p>
          <ul>
            <li class="player" v-for="(item, index) in userWhiteList" v-bind:key="index">
              <img class="avatar" :src="item.avatarUrl" alt="User Avatar" />
              <p class="name">{{ item.name }}</p>
              <MCButton class="button" v-if="item.uuid !== avatarUUID" @click="editAvatar(item.uuid)"
                >设置为头像</MCButton
              >
            </li>
          </ul>
        </div>
        <div class="menu">
          <MCRouterLink class="button" to="/Query/Guarantee"> 担保查询 </MCRouterLink>
          <MCRouterLink class="button" to="/Query/Examination"> 考试查询 </MCRouterLink>
          <MCRouterLink v-if="isAdmin" class="button" to="/admin"> 管理 </MCRouterLink>
        </div>
      </div>
      <div class="end">
        <MCRouterLink to="/" class="button">返回</MCRouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 30px;
  overflow-y: hidden;
}
@media (max-width: 600px) {
  .main {
    gap: 10px;
  }
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
  min-height: 100px;
  max-height: 270px;
  overflow-y: auto;
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
    height: 55px;
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
  min-height: 150px;
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
