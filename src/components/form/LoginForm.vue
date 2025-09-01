<script setup>
import '../../assets/form.css';
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
  openAlert('登陆中');
  if (!checkPassword(loginForm.value.password)) {
    openAlert('密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度为8-16个字符');
    return;
  }

  user
    .login({
      username: loginForm.value.username,
      password: loginForm.value.password,
    })
    .then((res) => {
      if (res.data.code === 0) {
        openAlert('登录成功! 即将跳转...');
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
        openAlert(res.data.desc);
      }
    })
    .catch((err) => {
      openAlert('登录错误!');
    });
};
</script>

<template>
  <div class="form">
    <h2>
      登录<span class="version">{{ appVersion }}</span>
    </h2>
    <input type="text" placeholder="用户名" v-model="loginForm.username" />
    <input type="password" placeholder="密码" v-model="loginForm.password" />
    <p>密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度为8-16个字符。</p>
    <p style="display: flex; justify-content: space-between; padding: 0 10px">
      <RouterLink to="/auth/register" class="toReg">还没有账号？</RouterLink>
      <RouterLink to="/auth/find_password" class="toReg">忘记密码？</RouterLink>
    </p>
    <MCButton @click="sendLogin">登录</MCButton>
  </div>
</template>

<style scoped>
.form {
  position: relative;
}
.version {
  font-weight: normal;
  font-size: 12px;
  color: #ccc;
  position: absolute;
  right: 0;
}
</style>
