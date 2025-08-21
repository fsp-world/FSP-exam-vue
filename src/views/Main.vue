<script setup>
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { openAlert } from '@/utils/TsAlert';

const store = useUserStore();
const { isLogin, username, avatar, playPermission } = storeToRefs(store);

const logout = () => {
  store.logout().then((res) => {
    openAlert({
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
      <MCRouterLink v-if="!playPermission" to="/guarantee" class="minecraft-button"> 熟人担保 </MCRouterLink>
      <MCRouterLink v-if="!playPermission" to="/prepareForTheExam" class="minecraft-button"> 参加考试 </MCRouterLink>
      <MCRouterLink v-if="playPermission" style="pointer-events: none" to="/" class="minecraft-button">
        信息查询（建设中）
      </MCRouterLink>
      <MCRouterLink v-if="playPermission" style="pointer-events: none" to="/" class="minecraft-button">
        事务大厅（建设中）
      </MCRouterLink>
      <div class="sub-menu">
        <MCRouterLink to="https://www.fsp.ink" class="minecraft-button"> 文档中心 </MCRouterLink>
        <MCRouterLink to="/space" class="minecraft-button"> 个人中心 </MCRouterLink>
        <button class="minecraft-button avatar">
          <RouterLink :to="!isLogin ? '/auth' : '/space'">
            <img :title="!isLogin ? '' : '点我进入个人中心'" class="avatar-img" :src="avatar" alt="头像" width="100%" />
            <span class="avatat-hover">{{ !isLogin ? '未登录' : username }}</span>
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
  background-image: var(--bg-img);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}

.exam-index .logo {
  display: block;
  margin: 0 auto;
  margin-top: 10%;
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
  button {
    font-size: 30px;
    width: 100%;
    height: 70px;
  }

  .sub-menu {
    display: flex;
    justify-content: center;
    gap: 10px;
    width: 100%;
    position: relative;
    button {
      width: 50%;
    }
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
    .avatar-img {
      image-rendering: pixelated;
      border-radius: 5px;
      border: 3px solid #000;
      height: 66px;
      width: 66px;
    }
    a {
      color: #fff;
    }
    span {
      padding: 5px;
    }
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
}

@media screen and (max-width: 950px) {
  .exam-index {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .exam-index .menu {
    padding-bottom: 30%;
    button {
      height: 60px;
    }
    .avatar {
      display: none;
    }
  }
  .exam-index .logo {
    padding-top: 30%;
    width: 100vw;
  }
}
</style>
