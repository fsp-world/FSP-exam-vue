<script setup lang="ts">
import { ref } from 'vue';
import { getPlayerChainOfTrust } from '@/apis/user';
import type { FetchResponse } from '@/types';
import { openAlert } from '@/utils/TsAlert';
import MCButton from './MCButton.vue';
import { getProfilePic } from '@/apis/mj';

interface Item {
  applicant: {
    id: number
    username: string
    avatar: string // UUID
    user_qq: string
    avatarUrl: string | undefined
  }
  guarantor: {
    id: number
    username: string
    avatar: string // UUID
    user_qq: string
    warning: string
  }
}
interface Props {
  isModalVisible: boolean
  uuid: string
}

interface Emits {
  (e: 'update:isModalVisible', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  isModalVisible: false,
})

const emit = defineEmits<Emits>()

const chain = ref<Item[]>([])
const playerName = ref('')

const queryChainOfTrust = (uuid: string) => {
  getPlayerChainOfTrust(uuid).then((res: FetchResponse) => {
    if (res.data.code === 0) {
      chain.value = res.data.data.chain.reverse()
      playerName.value = res.data.data.playerName

      const avatarPromises = chain.value.map((item) =>
        getProfilePic(item.applicant.avatar)
          .then((avatar) => {
            if (avatar.msg === 'ok') {
              item.applicant.avatarUrl = avatar.imgUrl;
            }
          })
          .catch((err) => {
            console.warn(`Failed to fetch avatar`, err);
          }),
      );
      return Promise.all(avatarPromises);

    } else {
      openAlert('信任链加载失败！', 'warn-card');
    }
  })
}

queryChainOfTrust(props.uuid)
</script>
<template>
  <div class="main">
    <!-- <ul>
      <li v-for="item in chain"> {{ item }}</li>
    </ul> -->
    <p>白名单用户 {{ playerName }} 的信任链</p>
    <ul>
      <li :key="index" v-for="(item, index) in chain" :style="{ '--indent': (index + 1) * 50 + 'px' }"
        style="padding-left: var(--indent);">
        <img class="avatar" :src="item.applicant.avatarUrl" alt="User Avatar" />
        <div class="name">{{ item.applicant.username }}</div>
      </li>
    </ul>
    <MCButton class="button" @click="emit('update:isModalVisible', false)">关闭</MCButton>
  </div>

</template>
<style scoped>
p {
  text-align: center;
  font-size: var(--text-font-size-large);
}

ul {
  margin: 0 auto;
}

li {
  --hei: 40px;
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  .name {
    font-size: var(--text-font-size-medium);
    line-height: var(--hei);
  }
}

.avatar {

  image-rendering: pixelated;
  border-radius: 5px;
  height: var(--hei);
  border: 3px solid #000;
}

.main {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
}

.button {
  width: 100%;
}
</style>
