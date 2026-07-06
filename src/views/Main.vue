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
  <div class="bg">
    <div class="main">
      <img class="logo" src="../assets/images/logo.png" />
      <div class="menu pc">
        <MCRouterLink v-if="!playPermission" to="/guarantee" class="minecraft-button">熟人担保</MCRouterLink>
        <MCRouterLink v-if="!playPermission" to="/prepareForTheExam" class="minecraft-button">参加考试</MCRouterLink>
        <MCRouterLink v-if="playPermission" to="/online-stats" class="minecraft-button">在线统计</MCRouterLink>
        <MCRouterLink v-if="playPermission" to="/resourceCenter" class="minecraft-button">资源中心</MCRouterLink>
        <div class="sub-menu">
          <MCRouterLink :length="'medium'" to="https://www.fsp.ink" class="minecraft-button"> 文档中心 </MCRouterLink>
          <MCRouterLink :length="'medium'" to="/space" class="minecraft-button"> 个人中心 </MCRouterLink>
          <button class="minecraft-button avatar">
            <RouterLink :to="!isLogin ? '/auth' : '/space'">
              <img :title="!isLogin ? '' : '点我进入个人中心'" class="avatar-img" :src="avatar" alt="头像" width="100%" />
              <span class="avatat-hover">{{ !isLogin ? '未登录' : username }}</span>
            </RouterLink>
            <a v-show="isLogin" class="logout" @click="logout">退出登录</a>
          </button>
        </div>
      </div>
      <div class="menu mobile">
        <MCRouterLink :length="'medium'" v-if="!playPermission" to="/guarantee" class="minecraft-button">熟人担保
        </MCRouterLink>
        <MCRouterLink :length="'medium'" v-if="!playPermission" to="/prepareForTheExam" class="minecraft-button">参加考试
        </MCRouterLink>
        <MCRouterLink :length="'medium'" v-if="playPermission" to="/online-stats" class="minecraft-button">在线统计
        </MCRouterLink>
        <MCRouterLink :length="'medium'" v-if="playPermission" to="/resourceCenter" class="minecraft-button">资源中心
        </MCRouterLink>
        <div class="sub-menu">
          <MCRouterLink :length="'short'" to="https://www.fsp.ink" class="minecraft-button"> 文档中心 </MCRouterLink>
          <MCRouterLink :length="'short'" to="/space" class="minecraft-button"> 个人中心 </MCRouterLink>
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

  </div>
</template>

<style scoped>
.bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-image: var(--bg-img);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main {
  margin-bottom: 5%;
}

.logo {
  margin: 0 auto;
  width: 100vw;
  max-width: 800px;
  user-select: none;
  -webkit-user-drag: none;
  animation: fadeInUp 0.35s ease-out;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.03);
}

.menu {
  --gap: 10px;
  display: flex;
  gap: var(--gap);
  flex-wrap: wrap;
  padding: 30px;
  animation: fadeInUp 0.35s ease-out 0.1s both;

  button {
    font-size: 30px;
    width: 100%;
    height: 70px;
  }

  .sub-menu {
    display: flex;
    justify-content: center;
    gap: var(--gap);
    width: 100%;
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

.pc {
  display: flex;
}

.mobile {
  display: none;
}


@media screen and (max-width: 950px) {
  .menu {
    .avatar {
      display: none;
    }
  }
}

@media screen and (max-width: 700px) {
  .logo {
    margin-bottom: 20%;
  }
}

@keyframes fadeInUp {
  from {
    opacity: .25;
    transform: scale(.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media screen and (max-width: 550px) {

  .pc {
    display: none;
  }

  .mobile {
    display: flex;
  }
}
</style>
