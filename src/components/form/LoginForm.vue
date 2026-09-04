<script setup lang="ts">
import '@/assets/authForm.css';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { openAlert } from '@/utils/TsAlert';
import { LOGIN_MESSAGES } from '@/constants/messages';
import MCButton from '@/components/MCButton.vue';

const appVersion = __APP_VERSION__;

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const loginForm = ref({
  username: '',
  password: '',
});
const sendLogin = () => {
  openAlert(LOGIN_MESSAGES.CHECKING);

  user
    .login({
      username: loginForm.value.username,
      password: loginForm.value.password,
    })
    .then((res: any) => {
      if (res.data.code === 0) {
        openAlert(LOGIN_MESSAGES.SUCCESS);
        setTimeout(() => {
          // 获取目标页面路径
          const redirect = route.query.redirect;
          // 如果存在目标页面路径，则跳转到该页面；否则跳转到首页
          if (typeof redirect === 'string') {
            router.push(redirect);
          } else {
            router.push({ name: 'Main' });
          }
        }, 2000);
      } else if (res.data.code === 1) {
        openAlert(res.data.desc);
      }
    })
    .catch((err) => {
      openAlert(LOGIN_MESSAGES.FAILED);
    });
};
</script>

<template>
  <form class="form">
    <div class="title">
      登录<span class="version">{{ appVersion }}</span>
    </div>
    <input type="text" placeholder="用户名" v-model="loginForm.username" />
    <input type="password" placeholder="密码" v-model="loginForm.password" />
    <p style="display: flex; justify-content: space-between; padding: 0 10px">
      <RouterLink to="/auth/register" class="link">还没有账号？</RouterLink>
      <RouterLink to="/auth/find_password" class="link">忘记密码？</RouterLink>
    </p>
    <MCButton :length="'long'" style="width: 100%" @click="sendLogin">登录</MCButton>
    <MCRouterLink :length="'long'" style="width: 100%" to="/">返回主页</MCRouterLink>
  </form>
</template>
