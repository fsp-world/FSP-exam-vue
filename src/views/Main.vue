<script setup>
import { getProfilePic } from '@/apis/mj.js';
import { getUserInfo } from '@/apis/user.js';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useAlertStore } from '@/stores/alert';

const store = useUserStore();
const { isLogin, username, isAdmin, avatar } = storeToRefs(store);

const alertStore = useAlertStore();

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
  getProfilePic(user.value.avatar).then((res) => {
    if (res.msg === 'ok') {
      user.value.avatar = res.imgUrl;
    }
  });
});

const logout = () => {
  store.logout().then((res) => {
    alertStore.openAlert({
      title: 'logout' + Date(),
      type: 'info-card',
      message: '成功退出登录',
      age: 3000,
      flag: true,
    });
  });
};
</script>

<template>
  <div class="exam-index">
    <img class="logo" src="../assets/images/logo.png" />
    <div class="menu">
      <MCRouterLink to="/guarantee" class="choice-button"> 熟人担保 </MCRouterLink>
      <MCRouterLink to="/prepareForTheExam" class="choice-button"> 参加考试 </MCRouterLink>
      <div class="sub-menu">
        <MCRouterLink to="https://www.fsp.ink" class="minecraft-button choice-button"> 返回主页</MCRouterLink>
        <MCRouterLink to="/space" class="choice-button"> 个人中心 </MCRouterLink>
        <button class="minecraft-button choice-button avatar">
          <RouterLink v-show="!isLogin" to="/auth">
            <img class="avatar-img" :src="user.avatar" alt="头像" width="100%" />
            <span class="avatat-hover">未登录!</span>
          </RouterLink>
          <RouterLink v-show="isLogin" to="/space">
            <img title="点我进入个人中心" class="avatar-img" :src="user.avatar" alt="头像" width="100%" />
            <span class="avatat-hover">{{ username }}</span>
          </RouterLink>
          <a v-show="isLogin" class="logout" @click="logout">退出登录</a>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.exam-index {
  width: 100%;
  height: 100vh;
  position: absolute;
  background-image: url('/src/assets/images/bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}

.exam-index .logo {
  display: block;
  margin: 0 auto;
  margin-top: 6%;
  user-select: none;
  -webkit-user-drag: none;
}

.exam-index .menu {
  max-width: 700px;
  display: flex;
  margin: 0 auto;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 30px;
}

@media screen and (max-width: 800px) {
  .exam-index {
    display: flex;
    flex-direction: column;
    /* padding-top: 30%; */
    justify-content: space-between;
  }
  .exam-index .menu {
    padding-bottom: 30%;
  }
  .exam-index .logo {
    padding-top: 30%;
    width: 100vw;
  }
  .exam-index .avatar {
    display: none;
  }
}
.exam-index .sub-menu {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.exam-index .sub-menu button {
  width: 50%;
}

.exam-index .choice-button {
  font-size: 30px;
  width: 100%;
  height: 70px;
}

.exam-index .choice-button a {
  color: #fff;
}
.sub-menu {
  position: relative;
}

.avatar {
  top: 0;
  right: 0;
  margin-right: -10px;
  position: absolute;
  display: block;
  width: 70px !important;
  height: 70px;
  box-sizing: border-box;
  transform: translate(100%, 0);
  border-radius: 5px;
}

.avatar-img {
  image-rendering: pixelated;
  border-radius: 5px;
  border: 3px solid #000;
  height: 66px;
  width: 66px;
}

.avatar:hover .avatat-hover,
.avatar:hover .logout {
  display: inline-block;
}

.avatat-hover {
  display: none;
  word-break: normal;
  white-space: nowrap;
  top: -4px;
  left: 50%;
  background: #cccccc8a;
  position: absolute;
  transform: translate(-50%, -100%);
}

.logout {
  display: none;
  word-break: normal;
  white-space: nowrap;
  position: absolute;
  padding: 10px 14px;
  bottom: 0;
  transform: translate(-50%, 100%);
  background: #cccccc8a;
  font-size: 20px;
}

.logout:hover {
  color: aqua;
}
</style>
