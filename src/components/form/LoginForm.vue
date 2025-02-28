<script setup>
import '../../assets/form.css';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { checkPassword } from '@/utils/passwordUtil';
import { useDialogStore } from '@/stores/alert';
import MCButton from '@/components/MCButton.vue';

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const dialogStore = useDialogStore();
const openDialog = (message) => {
  const data = {
    title: 'login' + Date(),
    type: 'info-card',
    message: message,
    age: 3000,
    flag: true,
  };
  dialogStore.openDialog(data);
};

const loginForm = ref({
  username: '',
  password: '',
});
const sendLogin = () => {
  openDialog('登陆中');
  if (!checkPassword(loginForm.value.password)) {
    openDialog('密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度至少为8个字符');
    return;
  }

  user
    .login({
      username: loginForm.value.username,
      password: loginForm.value.password,
    })
    .then((res) => {
      if (res.data.code === 0) {
        openDialog('登录成功! 即将跳转...');
        setTimeout(() => {
          // 获取目标页面路径
          const redirect = route.query.redirect;
          // 如果存在目标页面路径，则跳转到该页面；否则跳转到首页
          if (redirect) {
            router.push(redirect);
          } else {
            router.push({ name: 'Main' });
          }
        }, 2000);
      } else if (res.data.code === 1) {
        openDialog(res.data.desc);
      }
    })
    .catch((err) => {
      openDialog('登录错误!');
    });
};
</script>

<template>
  <div class="form">
    <h2>登录</h2>
    <input type="text" placeholder="用户名" v-model="loginForm.username" />
    <input type="password" placeholder="密码" v-model="loginForm.password" />
    <p>密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度至少为8个字符。</p>
    <RouterLink to="/auth/register" class="toReg">还没有账号？</RouterLink>
    <MCButton @click="sendLogin">登录</MCButton>
  </div>
</template>

<style scoped></style>
