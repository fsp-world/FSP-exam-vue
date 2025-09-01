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

const registerForm = ref({
  username: '',
  userQQ: '',
  password: '',
  repassword: '',
});

const sendRegister = () => {
  if (registerForm.value.password === registerForm.value.repassword) {
    if (!checkPassword(registerForm.value.password)) {
      openAlert('密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度为8-16个字符');
      return;
    }
    user
      .register({
        username: registerForm.value.username,
        userQQ: registerForm.value.userQQ,
        password: registerForm.value.password,
        repassword: registerForm.value.repassword,
      })
      .then((res) => {
        if (res.data.code === 0) {
          openAlert('注册成功! 即将跳转...');
          setTimeout(() => {
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
          });
        } else {
          openAlert(res.data.desc);
        }
      })
      .catch((err) => {
        openAlert('出现错误!');
      });
  } else {
    openAlert('密码不一致');
  }
};
</script>

<template>
  <div class="form">
    <h2>
      注册<span class="version">{{ appVersion }}</span>
    </h2>
    <input type="text" placeholder="用户名" v-model="registerForm.username" />
    <input type="text" placeholder="QQ号" v-model="registerForm.userQQ" />
    <input type="password" placeholder="密码" v-model="registerForm.password" />
    <input type="password" placeholder="确认密码" v-model="registerForm.repassword" />
    <p>密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度为8-16个字符。</p>
    <p
      v-if="registerForm.repassword && registerForm.password !== registerForm.repassword"
      style="color: red; font-size: 12px"
    >
      两次输入的密码不一致。
    </p>
    <RouterLink to="/auth/login" class="toReg">已有账号？</RouterLink>
    <MCButton @click="sendRegister">注册</MCButton>
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
