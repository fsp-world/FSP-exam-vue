<template>
  <div class="activation-form">
    <h2 style="text-align: center">激活账户</h2>
    <input class="input" type="text" v-model.trim="username" placeholder="请输入用户名" />
    <div style="display: flex; justify-content: center">
      <MCButton class="btn" @click="sendActivation">激活</MCButton>
    </div>
  </div>
</template>

<script setup>
import MCButton from '@/components/MCButton.vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { activation } from '@/apis/auth';
import { openAlert } from '@/utils/TsAlert';

const router = useRouter();
const route = useRoute();

const token = route.query.token;
if (!token) {
  router.replace('/');
}

const username = ref('');

const sendActivation = () => {
  activation({ username: username.value }, token)
    .then((res) => {
      const data = res.data;
      if (data.code === 0) {
        openAlert(data.desc);
        router.replace('/');
      } else {
        openAlert(data.desc);
      }
    })
    .catch((err) => {
      openAlert(err.response.data.desc)
    });
};
</script>

<style scoped>
.activation-form {
  background-color: bisque;
  padding: 20px;
  border-radius: 14px;
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  .input {
    padding: 10px 20px;
    border-radius: 10px;
    outline: none;
  }
  .btn {
    margin-top: 20px;
    padding: 10px 20px;
  }
}
</style>
