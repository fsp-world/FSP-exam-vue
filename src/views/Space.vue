<script setup lang="ts">
import { getProfilePic } from '@/apis/mj';
import { getUserWhitelist } from '@/apis/user';
import { sendActivation } from '@/apis/auth';
import { ref } from 'vue';
import { openAlert } from '@/utils/TsAlert';
import { useUserStore } from '@/stores/user';
import MCRouterLink from '@/components/MCRouterLink.vue';
import MCButton from '@/components/MCButton.vue';
import MCDialog from '@/components/MCDialog.vue';
import PlayerChainOfTrust from '@/components/PlayerChainOfTrust.vue';
import BackgroundSettings from '@/components/BackgroundSettings.vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();

const displayChainOfTrustPanel = ref(false)
const displayBgPanel = ref(false)

const userStore = useUserStore();
const {
  avatar,
  username,
  userQQ,
  avatarUUID,
  getStatus,
  dateToLocal,
  isAdmin,
  status,
  getJoinSeason,
  playPermission,
  roleText,
} = storeToRefs(userStore);

userStore.syncUserInfo();

const userWhiteList = ref<UserWhitelistItem[]>([]);

interface UserWhitelistItem {
  name: string;
  uuid: string;
  avatarUrl?: string;
}

getUserWhitelist().then((res: any) => {
  if (res.data.code === 0) {
    userWhiteList.value = res.data.list;
    const avatarPromises = userWhiteList.value.map((player) =>
      getProfilePic(player.name)
        .then((avatar) => {
          if (avatar.msg === 'ok') {
            player.avatarUrl = avatar.imgUrl;
          }
        })
        .catch((err) => {
          console.warn(`Failed to fetch avatar for ${player.name}:`, err);
        }),
    );
    return Promise.all(avatarPromises);
  }
});

const setAvatar = (uuid: string) => {
  userStore.setAvatar(uuid).then((res: any) => {
    if (res.data.code === 0) {
      openAlert('头像修改成功');
    } else {
      openAlert('头像修改失败！');
    }
  });
};

const reqActivation = () => {
  sendActivation().then((res: any) => {
    openAlert(res.data.desc);
  });
};

const queryUUID = ref('')
const queryChainOfTrust = (uuid: string) => {
  queryUUID.value = uuid
  displayChainOfTrustPanel.value = true
}

const logout = () => {
  userStore.logout().then((res) => {
    openAlert({
      title: 'logout' + Date(),
      type: 'info-card',
      message: '成功退出登录',
      age: 3000,
      flag: true,
    });
    router.push('/');
  });
};
</script>

<template>
  <div class="space">
    <MCDialog :style="'card'" v-model:is-modal-visible="displayChainOfTrustPanel">
      <PlayerChainOfTrust :uuid="queryUUID" v-model:is-modal-visible="displayChainOfTrustPanel"></PlayerChainOfTrust>
    </MCDialog>
    <MCDialog :style="'card'" v-model:is-modal-visible="displayBgPanel">
      <BackgroundSettings v-model:is-modal-visible="displayBgPanel" />
    </MCDialog>
    <div class="translucent-bg"></div>
    <div class="translucent-content">
      <div class="title">
        <p>个人空间</p>
      </div>
      <div class="main">
        <Transition name="stagger" appear>
          <div class="user-info" :style="{ transitionDelay: '0s' }">
            <div class="avatar hover-scale">
              <img :src="avatar" alt="User Avatar" />
            </div>
            <div class="user-details">
              <div class="username">{{ username }}</div>
              <p>绑定QQ: {{ userQQ }}</p>
              <p>角色: {{ roleText }} ({{ getJoinSeason }})</p>
              <p>加入日期: {{ dateToLocal }}</p>
              <p>账号状态: {{ getStatus }}</p>
            </div>
          </div>
        </Transition>
        <Transition name="stagger" appear>
          <div class="white-list y-scroll" :style="{ transitionDelay: '0.1s' }">
            <p class="title">授权的游戏账户</p>
            <ul>
              <li class="player" v-for="(item, index) in userWhiteList" :key="index">
                <img title="点击查看信任链" @click="queryChainOfTrust(item.uuid)" class="avatar" :src="item.avatarUrl"
                  alt="User Avatar" />
                <p class="name">{{ item.name }}</p>
                <MCButton class="button" v-if="item.uuid !== avatarUUID" @click="setAvatar(item.uuid)">设置为头像</MCButton>
              </li>
            </ul>
          </div>
        </Transition>
        <Transition name="stagger" appear>
          <div class="menu y-scroll" :style="{ transitionDelay: '0.2s' }">
            <MCRouterLink class="button" v-if="playPermission" to="https://www.fsp.ink/docs/join/">
              游玩指南
            </MCRouterLink>
            <MCRouterLink class="button" v-if="playPermission" to="/guarantee"> 熟人担保 </MCRouterLink>
            <MCRouterLink class="button" v-if="playPermission" to="/prepareForTheExam"> 参加考试 </MCRouterLink>
            <MCRouterLink class="button" to="/Query/Guarantee"> 担保查询 </MCRouterLink>
            <MCRouterLink class="button" to="/Query/Examination"> 考试查询 </MCRouterLink>
            <MCRouterLink class="button" v-if="isAdmin" to="/admin"> 网站管理 </MCRouterLink>
            <MCButton class="button" v-if="status === 0" @click="reqActivation"> 激活账户 </MCButton>
            <MCButton class="button" @click="displayBgPanel = true"> 自定义背景 </MCButton>
            <MCButton class="button" @click="logout"> 退出登录 </MCButton>
          </div>
        </Transition>
      </div>
      <div class="end">
        <MCRouterLink to="/" class="button">返回</MCRouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stagger-enter-active {
  transition: all 0.5s ease;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-y: hidden;
}

.user-info {
  margin-top: 10px;
  width: calc(100% - 40px);
  max-width: 440px;
  height: 150px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);

  .username {
    font-size: var(--title-font-size-medium);
    padding-bottom: 5px;
  }

  .avatar {
    margin-right: 20px;
    border-radius: 10px;
    overflow: hidden;
    image-rendering: pixelated;
    user-select: none;
    box-shadow: 3px 3px 10px black;
  }

  .avatar img {
    width: 100px;
    height: auto;
  }

  .hover-scale {
    transition: transform 0.4s ease;
  }

  .hover-scale:hover {
    transform: scale(1.1);
  }

  .user-details h2 {
    margin-top: 0;
  }

  .form-group {
    margin-bottom: 15px;
  }
}

.white-list {
  width: calc(100% - 40px);
  max-width: 440px;
  min-height: 100px;
  max-height: 270px;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.3);

  .title {
    text-align: center;
    font-size: 20px;
    padding-bottom: 10px;
    user-select: none;
  }

  .player {
    display: flex;
    justify-content: space-between;
    --hei: 50px;
    padding: 5px 0;
    height: 55px;

    .avatar {
      image-rendering: pixelated;
      border-radius: 5px;
      height: var(--hei);
      border: 3px solid #000;
      user-select: none;
      cursor: pointer;
    }

    .name {
      width: 100%;
      font-size: 20px;
      line-height: var(--hei);
      padding: 0 10px;
      text-align: left;
    }

    .button {
      width: 200px;
      font-size: 16px;
    }
  }

  .player:hover {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }
}

.menu {
  width: 100%;
  max-width: 440px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;

  .button {
    width: 100%;
    height: 50px;
    background-color: #4fc08d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--button-font-size-medium);
  }

  .button:hover {
    background-color: #42b883;
  }
}
</style>
