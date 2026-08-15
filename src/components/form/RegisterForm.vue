<script setup lang="ts">
import '@/assets/authForm.css';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { checkPassword } from '@/utils/passwordUtil';
import { openAlert } from '@/utils/TsAlert';
import { LOGIN_MESSAGES, REGISTER_MESSAGES } from '@/constants/messages';
import MCButton from '@/components/MCButton.vue';

const appVersion = __APP_VERSION__;

const router = useRouter();
const route = useRoute();
const user = useUserStore();

const registerForm = ref({
  username: '',
  userQQ: '',
  password: '',
  passwordAgain: '',
});

const sendRegister = () => {
  if (registerForm.value.password === registerForm.value.passwordAgain) {
    if (!checkPassword(registerForm.value.password)) {
      openAlert(LOGIN_MESSAGES.INVALID_PASSWORD);
      return;
    }
    user
      .register({
        username: registerForm.value.username,
        userQQ: registerForm.value.userQQ,
        password: registerForm.value.password,
        passwordAgain: registerForm.value.passwordAgain,
      })
      .then((res: any) => {
        if (res.data.code === 0) {
          openAlert(REGISTER_MESSAGES.SUCCESS);
          setTimeout(() => {
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
          });
        } else {
          openAlert(res.data.desc);
        }
      })
      .catch((err) => {
        openAlert(REGISTER_MESSAGES.FAILED);
      });
  } else {
    openAlert(REGISTER_MESSAGES.PASSWORD_MISMATCH);
  }
};
</script>

<template>
  <div class="form">
    <div class="title">
      注册<span class="version">{{ appVersion }}</span>
    </div>
    <input type="text" placeholder="用户名" v-model="registerForm.username" />
    <input type="text" placeholder="QQ号" v-model="registerForm.userQQ" />
    <input type="password" placeholder="密码" v-model="registerForm.password" />
    <input type="password" placeholder="确认密码" v-model="registerForm.passwordAgain" />
    <p>{{ LOGIN_MESSAGES.INVALID_PASSWORD }}</p>
    <p v-if="registerForm.passwordAgain && registerForm.password !== registerForm.passwordAgain"
      style="color: red; font-size: 12px">
      {{ REGISTER_MESSAGES.PASSWORD_MISMATCH }}
    </p>
    <RouterLink to="/auth/login" class="link">已有账号？</RouterLink>
    <MCButton :length="'long'" style="width: 100%;" @click="sendRegister">注册</MCButton>
  </div>
</template>
