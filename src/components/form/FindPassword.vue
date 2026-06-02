<script setup lang="ts">
import '@/assets/authForm.css';
import { ref } from 'vue';
import { findPassword } from '@/apis/auth';
import { openAlert } from '@/utils/TsAlert';
import MCButton from '@/components/MCButton.vue';

const findPasswordForm = ref({
  username: '',
  userQQ: '',
});

const sendFindPassword = () => {
  if (findPasswordForm.value.userQQ == "" || findPasswordForm.value.username == "") {
    openAlert("请输入用户名和QQ")
  }
  findPassword(findPasswordForm.value)
    .then((res) => {
      openAlert(res.data.desc);
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

<template>
  <form class="form">
    <div class="title">找回密码</div>
    <input type="text" placeholder="用户名" v-model="findPasswordForm.username" />
    <input type="text" placeholder="QQ号" v-model="findPasswordForm.userQQ" />
    <RouterLink to="/auth/login" class="link">已有账号？</RouterLink>
    <MCButton :length="'long'" style="width: 100%;" @click="sendFindPassword">找回密码</MCButton>
  </form>
</template>
