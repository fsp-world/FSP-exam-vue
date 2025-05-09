<script setup>
import '../../assets/form.css';
import { ref } from 'vue';
import { findPassword } from '@/apis/auth';
import { openAlert } from '@/utils/TsAlert';
import MCButton from '@/components/MCButton.vue';

const findPasswordForm = ref({
  username: '',
  userQQ: '',
});

const sendFindPassword = () => {
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
  <div class="form">
    <h2>找回密码</h2>
    <input type="text" placeholder="用户名" v-model="findPasswordForm.username" />
    <input type="text" placeholder="QQ号" v-model="findPasswordForm.userQQ" />
    <RouterLink to="/auth/login" class="toReg">已有账号？</RouterLink>
    <MCButton @click="sendFindPassword">找回</MCButton>
  </div>
</template>

<style scoped></style>
