<script setup lang="ts">
import '@/assets/authForm.css';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { checkPassword } from '@/utils/passwordUtil';
import { openAlert } from '@/utils/TsAlert';
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
  if (!checkPassword(loginForm.value.password)) {
    openAlert('密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度为8-16个字符');
    return;
  }
  openAlert('登陆中');

  user
    .login({
      username: loginForm.value.username,
      password: loginForm.value.password,
    })
    .then((res: any) => {
      if (res.data.code === 0) {
        openAlert('登录成功! 即将跳转...');
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
      openAlert('登录错误!');
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
    <p>密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度为8-16个字符。</p>
    <p style="display: flex; justify-content: space-between; padding: 0 10px">
      <RouterLink to="/auth/register" class="link">还没有账号？</RouterLink>
      <RouterLink to="/auth/find_password" class="link">忘记密码？</RouterLink>
    </p>
    <MCButton :length="'long'" style="width: 100%;" @click="sendLogin">登录</MCButton>
    <MCRouterLink :length="'long'" style="width: 100%;" to="/">返回主页</MCRouterLink>
  </form>
</template>
