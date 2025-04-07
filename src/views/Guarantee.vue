<script setup lang="ts">
import { ref } from 'vue';
import { sendGuaranteeRequest } from '@/apis/guarantee';
import { openAlert } from '@/utils/TsAlert';

import ConfirmPlayer from '@/components/ConfirmPlayer.vue';
import MCButton from '@/components/MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';

interface UserInfo {
  playerName: string;
  playerUUID: string;
}

const guarantorInfo = ref<UserInfo>({
  playerName: '',
  playerUUID: 'none',
});

const userInfo = ref<UserInfo>({
  playerName: '',
  playerUUID: 'none',
});

const checkUser = ref(false);
const checkGuarantor = ref(false);

const send = () => {
  const data = {
    userInfo: userInfo.value,
    guarantorInfo: guarantorInfo.value,
  };

  sendGuaranteeRequest(data)
    .then((res: any) => {
      if (res.data.code === 0) {
        openAlert(res.data.desc, 'info-card');
      } else {
        openAlert(res.data.desc, 'warn-card');
      }
    })
    .catch((res: any) => {
      openAlert(res.data.desc, 'warn-card');
    });
};

const confirmedUser = () => {
  checkGuarantor.value = true;
};
const confirmedGuarantor = () => {
  send();
};

const startCheck = () => {
  // 检查用户是否填写必要信息
  if (userInfo.value.playerName && guarantorInfo.value.playerName) {
    // 这个组件只负责开启check，关闭check由confirm组件负责
    checkUser.value = true;
  } else {
    openAlert('请填信息');
  }
};
</script>

<template>
  <ConfirmPlayer v-model:check="checkUser" v-model:info="userInfo" @confirm="confirmedUser"></ConfirmPlayer>
  <ConfirmPlayer
    v-model:check="checkGuarantor"
    v-model:info="guarantorInfo"
    @confirm="confirmedGuarantor"
  ></ConfirmPlayer>
  <div class="guarantee">
    <div class="translucent-bg"></div>
    <div class="translucent-content">
      <div class="title">
        <p>熟人担保</p>
      </div>
      <div class="main">
        <div class="form">
          <p class="text">该玩家在网站上同意您的请求后您将获得白名单</p>
          <input
            :disabled="checkUser || checkGuarantor"
            type="text"
            placeholder="对方的游戏昵称"
            v-model="guarantorInfo.playerName"
          />
          <input
            :disabled="checkUser || checkGuarantor"
            type="text"
            placeholder="您的游戏昵称"
            v-model="userInfo.playerName"
          />
        </div>
      </div>
      <div class="end">
        <MCRouterLink to="/" class="button">返回</MCRouterLink>
        <MCButton type="button" :disabled="checkUser || checkGuarantor" class="button" @click="startCheck"
          >提交</MCButton
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.guarantee .main .form {
  width: 100%;
}

.guarantee .main .text {
  font-size: 27px;
  line-height: 50px;
  text-align: center;
  user-select: none;
}
</style>
